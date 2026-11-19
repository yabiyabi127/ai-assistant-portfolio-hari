"""Rebuild vector index from knowledge.json and backend/documents/*.pdf.
Run: python build_index.py (downloads embedding model on first use).
"""
from semantic import MODEL_NAME, build_index
from document_loader import load_documents

if __name__ == '__main__':
    docs = load_documents()
    print('Sources loaded:', len(docs), 'JSON + PDF source records')
    print('Embedding model:', MODEL_NAME)
    count = build_index()
    print(f'Semantic index ready: {count} chunks saved in semantic_index/')
