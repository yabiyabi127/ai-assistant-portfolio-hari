import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
"""Show which local sources will be indexed, without using embedding or Groq."""
from collections import Counter
from document_loader import load_documents

if __name__ == "__main__":
    docs = load_documents()
    counts = Counter(d.get("source_file", "unknown") for d in docs)
    print("Document ingestion preview — confirm the extracted text before build_index.py")
    for source, count in sorted(counts.items()):
        samples = [d for d in docs if d.get("source_file") == source]
        pages = sorted({d["page"] for d in samples if "page" in d})
        text = " ".join(d["content"] for d in samples)
        print(f"\nSOURCE: {source} | records/chunks: {count} | pages with text: {pages or 'JSON'}")
        print("EXCERPT:", text[:350].replace("\n", " "))
    print(f"\nTOTAL records: {len(docs)}")
    print("If important text is missing or out of order, do not build the index yet.")
