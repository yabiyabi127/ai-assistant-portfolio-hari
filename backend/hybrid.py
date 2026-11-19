"""Hybrid retrieval: normalized lexical matches + multilingual FAISS similarity.

Uses the same local knowledge file as V7; no external paid database.
Scores are relevance signals, not probabilities or proof of correctness.
"""
import re
from collections import Counter
from math import log

from semantic import search as semantic_search

STOP = set('yang dan dari untuk dengan pada tentang atau adalah itu ini apa apakah siapa how what where which the and for with from his her hari pernah pernahkah bisa to a an of in di ke saya kamu do does did'.split())
ALIASES = {'modular': 'micro frontend', 'modul': 'micro frontend', 'frontend': 'front end',
           'bank': 'mandiri', 'kuliah': 'universitas', 'pendidikan': 'universitas',
           'pengalaman': 'engineer', 'proyek': 'project', 'keterampilan': 'skills'}

def tokenize(value):
    words = re.findall(r'[a-z0-9]+', value.casefold())
    expanded = []
    for token in words:
        if len(token) > 1 and token not in STOP:
            expanded.append(token)
            expanded.extend(ALIASES.get(token, '').split())
    return expanded

def lexical_rank(query, documents):
    """Lightweight TF-IDF-style ranking over facts; titles get a mild boost."""
    q = Counter(tokenize(query))
    if not q:
        return []
    corpus = [(doc, Counter(tokenize(doc['title'] + ' ' + doc['content']))) for doc in documents]
    df = Counter()
    for _, terms in corpus:
        df.update(terms.keys())
    n = len(corpus)
    results = []
    for doc, terms in corpus:
        title = Counter(tokenize(doc['title']))
        score = sum((1 + log((n + 1) / (df[token] + 1))) * min(qty, terms[token]) * (1.7 if token in title else 1) for token, qty in q.items())
        if score > 0:
            results.append((score, doc))
    return [doc for _, doc in sorted(results, key=lambda x: -x[0])]

def retrieve_hybrid(query, documents, limit=8, semantic_fn=semantic_search):
    """Combine lexical and semantic rankings using reciprocal-rank fusion.

    semantic_fn may return None if the index isn't ready. In that case the
    method is correctly reported as keyword. Rank fusion rewards documents
    supported by both retrieval methods and doesn't pretend to be reranking
    by a cross-encoder.
    """
    lexical = lexical_rank(query, documents)
    try:
        semantic = semantic_fn(query, limit=min(12, len(documents)), min_score=0.30)
    except (ImportError, OSError, RuntimeError, ValueError) as exc:
        print(f'Semantic unavailable: {type(exc).__name__}: {str(exc)[:140]}')
        semantic = None
    if semantic is None:
        return lexical[:limit], 'keyword'
    scores = {}
    seen = {}
    for rank, doc in enumerate(semantic):
        key = doc['id']
        seen[key] = doc
        scores[key] = scores.get(key, 0) + 1.0 / (30 + rank + 1)
    for rank, doc in enumerate(lexical):
        key = doc['id']
        if key not in seen:
            seen[key] = doc
        scores[key] = scores.get(key, 0) + 1.3 / (30 + rank + 1)
    ordered = sorted(scores, key=lambda k: -scores[k])
    return [seen[k] for k in ordered[:limit]], 'hybrid'
