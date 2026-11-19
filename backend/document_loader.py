"""V9.1: JSON + general-purpose text-based PDFs for local portfolio RAG.

All text blocks are retained. Heuristic column ordering is deliberately modest:
layout-heavy files may still need inspection. Scanned/image-only PDFs need OCR,
which is not performed here. New PDF source files are not published automatically.
"""
import hashlib
import json
import re
import warnings
from pathlib import Path
from urllib.parse import quote

import pymupdf as fitz

ROOT = Path(__file__).resolve().parent
DOCUMENTS_DIR = ROOT / "documents"
PUBLIC_PDF_DIR = ROOT.parent / "public" / "assets" / "pdf"
LOADER_VERSION = "universal-pdf-v9.1-2"
MAX_PDF_BYTES = 20 * 1024 * 1024
MAX_PDF_PAGES = 80


def data_fingerprint():
    """Refresh FAISS when data OR the extraction approach changes."""
    digest = hashlib.sha256(LOADER_VERSION.encode("utf-8"))
    for path in [ROOT / "knowledge.json", *sorted(DOCUMENTS_DIR.glob("*.pdf"))]:
        digest.update(path.name.encode("utf-8"))
        digest.update(path.read_bytes())
    return digest.hexdigest()


def clean_text(text):
    """Remove common personal contact identifiers before RAG or LLM use."""
    text = re.sub(r"[\w.+-]+@[\w.-]+\.[a-z]{2,}", "[email redacted]", text, flags=re.I)
    text = re.sub(r"(?:\+?62|0)8[0-9\s().-]{8,17}", "[phone redacted]", text)
    text = re.sub(r"https?://\S+", "[link redacted]", text)
    # Some creative PDF layouts split an URL into separate text blocks.
    text = re.sub(r"(?i)(?<![a-z0-9])(?:[a-z0-9_.-]{3,})/(?=\s|$)", "[link fragment redacted]", text)
    return "\n".join(re.sub(r"[ \t]+", " ", line).strip() for line in text.splitlines()).strip()


def _blocks(page):
    """Return each text block once; never silently drop spanning blocks."""
    result = []
    for block in page.get_text("blocks"):
        if len(block) < 5 or not isinstance(block[4], str) or not block[4].strip():
            continue
        x0, y0, x1, y1 = map(float, block[:4])
        result.append({"x0": x0, "y0": y0, "x1": x1, "y1": y1,
                       "text": clean_text(block[4])})
    return [b for b in result if b["text"]]


def _column_split(blocks, page_width):
    """Find an actual gap between two groups of narrow text blocks.

    Do not assume CV dimensions. If evidence is weak, use normal reading order.
    """
    if len(blocks) < 4:
        return None
    # Only consider potential vertical columns. Wide headings span both columns.
    narrow = [b for b in blocks if b["x1"] - b["x0"] < page_width * 0.54]
    if len(narrow) < 4:
        return None
    # Candidate gutters from left/right bounds of blocks, avoiding page edges.
    candidate_splits = set()
    for a in narrow:
        for b in narrow:
            if a is b or b["x0"] <= a["x1"] + 9:
                continue
            split = (a["x1"] + b["x0"]) / 2
            if page_width * .28 <= split <= page_width * .72:
                candidate_splits.add(round(split, 2))
    candidates = []
    for split in candidate_splits:
        left = [b for b in narrow if b["x1"] <= split]
        right = [b for b in narrow if b["x0"] >= split]
        crossing = [b for b in narrow if b["x0"] < split < b["x1"]]
        if len(left) < 2 or len(right) < 2 or crossing:
            continue
        # Must have content on both sides at overlapping heights (true columns).
        parallel = sum(1 for l in left if any(
            max(l["y0"], r["y0"]) < min(l["y1"], r["y1"])
            for r in right))
        if parallel < 2:
            continue
        gap = min(r["x0"] for r in right) - max(l["x1"] for l in left)
        if gap <= 9:
            continue
        candidates.append((parallel * 3 + min(len(left), len(right)) + gap / page_width, split))
    if not candidates:
        return None
    return max(candidates)[1]


def _reading_order(page):
    """Sort all text blocks; use column order only when layout evidence supports it.

    Full-width blocks are written in vertical order. Between them, detected
    left/right columns are read independently; no text block is discarded.
    """
    blocks = _blocks(page)
    if not blocks:
        return []
    width = float(page.rect.width)
    split = _column_split(blocks, width)
    if split is None:
        return sorted(blocks, key=lambda b: (round(b["y0"] / 6), b["x0"], b["y0"]))

    spanning = [b for b in blocks if b["x0"] < split < b["x1"]]
    narrow = [b for b in blocks if b not in spanning]
    spanning.sort(key=lambda b: (b["y0"], b["x0"]))
    result = []
    remaining = narrow[:]
    for header in spanning:
        # Process the column region preceding a full-width heading.
        before = [b for b in remaining if b["y0"] < header["y0"]]
        remaining = [b for b in remaining if b not in before]
        result.extend(_order_region(before, split))
        result.append(header)
    result.extend(_order_region(remaining, split))
    return result


def _order_region(blocks, split):
    left = sorted((b for b in blocks if b["x1"] <= split), key=lambda b: (b["y0"], b["x0"]))
    right = sorted((b for b in blocks if b["x0"] >= split), key=lambda b: (b["y0"], b["x0"]))
    other = [b for b in blocks if b not in left and b not in right]
    # Crossing items are never ignored.
    return left + right + sorted(other, key=lambda b: (b["y0"], b["x0"]))


def pdf_sections(page):
    """Provide an ordered readable stream for an arbitrary text-based PDF page."""
    ordered = _reading_order(page)
    if ordered:
        yield "Page text", "\n".join(b["text"] for b in ordered)


def _split_text(text, max_chars, overlap):
    """Soft paragraph/word boundaries while guaranteeing forward progress."""
    if not 0 <= overlap < max_chars:
        raise ValueError("overlap must be >= 0 and smaller than max_chars")
    start = 0
    while start < len(text):
        end = min(len(text), start + max_chars)
        if end < len(text):
            lower = start + max_chars // 2
            newline = text.rfind("\n", lower, end)
            whitespace = text.rfind(" ", lower, end)
            boundary = newline if newline >= lower else whitespace
            if boundary > start:
                end = boundary
        chunk = text[start:end].strip()
        if chunk:
            yield chunk
        if end >= len(text):
            break
        start = max(start + 1, end - overlap)


def make_pdf_chunks(pdf_path, max_chars=620, overlap=90):
    """Create source-labeled snippets for ANY text-based PDF, not only CVs."""
    pdf_path = Path(pdf_path)
    if pdf_path.stat().st_size > MAX_PDF_BYTES:
        raise ValueError(f"PDF exceeds 20 MB: {pdf_path.name}")
    items = []
    empty_pages = []
    published = PUBLIC_PDF_DIR / pdf_path.name
    is_published = (published.is_file() and
                    hashlib.sha256(published.read_bytes()).digest() ==
                    hashlib.sha256(pdf_path.read_bytes()).digest())
    with fitz.open(pdf_path) as pdf:
        if len(pdf) > MAX_PDF_PAGES:
            raise ValueError(f"PDF exceeds {MAX_PDF_PAGES} pages: {pdf_path.name}")
        for page_num, page in enumerate(pdf, start=1):
            sections = list(pdf_sections(page))
            if not sections:
                empty_pages.append(page_num)
                continue
            for section, body in sections:
                for i, content in enumerate(_split_text(body, max_chars, overlap), start=1):
                    # PDF links only when a file of the same name has already been
                    # deliberately published. Do not expose new knowledge files.
                    public_url = (f"/assets/pdf/{quote(pdf_path.name)}#page={page_num}"
                                  if is_published else None)
                    items.append({
                        "id": f"pdf:{pdf_path.name}:page:{page_num}:chunk:{i}",
                        "title": f"{pdf_path.stem} — page {page_num}",
                        "content": content,
                        "url": public_url,
                        "source_type": "pdf",
                        "source_file": pdf_path.name,
                        "page": page_num,
                    })
    if not items:
        raise ValueError(f"No selectable text found in {pdf_path.name}. Scan/image-only PDF needs OCR.")
    if empty_pages:
        warnings.warn(f"{pdf_path.name}: no selectable text on pages {empty_pages}; check scan/images.", stacklevel=2)
    return items


def load_documents():
    source = json.loads((ROOT / "knowledge.json").read_text(encoding="utf-8"))
    docs = [{**doc, "source_type": "json", "source_file": "knowledge.json"} for doc in source]
    for pdf in sorted(DOCUMENTS_DIR.glob("*.pdf")):
        docs.extend(make_pdf_chunks(pdf))
    return docs
