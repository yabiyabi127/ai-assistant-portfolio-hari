"""Local semantic retrieval for portfolio facts (Sentence Transformers + FAISS).

Index is generated explicitly by build_index.py; the server does not download
models or silently rebuild the index during user requests.
"""
import json
import os
from pathlib import Path
from threading import Lock

from document_loader import data_fingerprint, load_documents

ROOT = Path(__file__).resolve().parent
INDEX_DIR = ROOT / 'semantic_index'
MODEL_NAME = os.getenv('EMBEDDING_MODEL', 'sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')
_lock = Lock()
_runtime = None


def knowledge_digest():
    return data_fingerprint()


def make_chunks(documents, max_chars=520, overlap=80):
    """Split individual facts without joining unrelated portfolio sections."""
    chunks = []
    for doc in documents:
        body = doc['content'].strip()
        if not body:
            continue
        start = 0
        while start < len(body):
            end = min(len(body), start + max_chars)
            if end < len(body):
                boundary = body.rfind(' ', start + max_chars // 2, end)
                if boundary > start:
                    end = boundary
            text = body[start:end].strip()
            if text:
                chunks.append({
                    'id': doc['id'] if start == 0 else f"{doc['id']}:part:{start}", 'title': doc['title'],
                    'content': text, 'url': doc['url'],
                    'source_type': doc.get('source_type', 'json'),
                    'source_file': doc.get('source_file', 'knowledge.json'),
                    **({'page': doc['page']} if 'page' in doc else {}),
                })
            if end >= len(body):
                break
            start = max(start + 1, end - overlap)
    return chunks


def index_status():
    manifest = INDEX_DIR / 'manifest.json'
    binary = INDEX_DIR / 'vectors.faiss'
    if not manifest.exists() or not binary.exists():
        return {'ready': False, 'reason': 'index_missing'}
    try:
        meta = json.loads(manifest.read_text(encoding='utf-8'))
        if meta['sha256'] != knowledge_digest():
            return {'ready': False, 'reason': 'index_outdated'}
        if meta['model'] != MODEL_NAME:
            return {'ready': False, 'reason': 'model_mismatch'}
        return {'ready': True, 'reason': None, 'chunks': len(meta['chunks']), 'model': MODEL_NAME}
    except (OSError, ValueError, KeyError, TypeError):
        return {'ready': False, 'reason': 'index_invalid'}


def build_index():
    """Explicit one-time indexing. Needs sentence-transformers, faiss-cpu."""
    import faiss
    import numpy as np
    from sentence_transformers import SentenceTransformer

    docs = load_documents()
    chunks = make_chunks(docs)
    if not chunks:
        raise ValueError('Knowledge base kosong')
    model = SentenceTransformer(MODEL_NAME, device='cpu')
    texts = [f"{d['title']}. {d['content']}" for d in chunks]
    vectors = np.asarray(model.encode(texts, show_progress_bar=True, normalize_embeddings=True), dtype='float32')
    index = faiss.IndexFlatIP(vectors.shape[1])
    index.add(vectors)
    # Write index first, then manifest last. Manifest fingerprints all sources.
    INDEX_DIR.mkdir(parents=True, exist_ok=True)
    faiss.write_index(index, str(INDEX_DIR / 'vectors.faiss'))
    (INDEX_DIR / 'manifest.json').write_text(json.dumps({
        'sha256': knowledge_digest(), 'model': MODEL_NAME, 'chunks': chunks,
    }, ensure_ascii=False, indent=2), encoding='utf-8')
    global _runtime
    _runtime = None
    return len(chunks)


def _get_runtime():
    global _runtime
    with _lock:
        state = index_status()
        if not state['ready']:
            return None
        if _runtime is None:
            import faiss
            from sentence_transformers import SentenceTransformer
            manifest = json.loads((INDEX_DIR / 'manifest.json').read_text(encoding='utf-8'))
            model = SentenceTransformer(MODEL_NAME, device='cpu')
            index = faiss.read_index(str(INDEX_DIR / 'vectors.faiss'))
            if index.ntotal != len(manifest['chunks']):
                raise ValueError('FAISS index dan metadata tidak sinkron. Jalankan build_index.py lagi.')
            _runtime = (model, index, manifest['chunks'])
        return _runtime


def search(query, limit=4, min_score=0.27):
    """Return evidence chunks and similarity scores, no fabricated documents."""
    import numpy as np
    state = _get_runtime()
    if state is None:
        return None  # Signals explicit fallback (index not ready).
    model, index, chunks = state
    vector = np.asarray(model.encode([query], normalize_embeddings=True), dtype='float32')
    scores, ids = index.search(vector, min(limit * 3, len(chunks)))
    results, seen = [], set()
    for score, idx in zip(scores[0].tolist(), ids[0].tolist()):
        if idx < 0 or score < min_score:
            continue
        doc = chunks[idx]
        # Avoid duplicate sections in a short context window.
        if doc['id'] in seen:
            continue
        seen.add(doc['id'])
        results.append({**doc, 'score': round(float(score), 3)})
        if len(results) == limit:
            break
    return results
