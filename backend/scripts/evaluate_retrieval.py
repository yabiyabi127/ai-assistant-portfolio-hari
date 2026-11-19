import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
"""Small transparent retrieval check; not a statistical accuracy benchmark."""
import json
from pathlib import Path
from hybrid import retrieve_hybrid

DATA = json.loads((Path(__file__).parent / 'knowledge.json').read_text(encoding='utf-8'))
CASES = [
    ('Apa pengalaman Hari menggunakan Angular di bank?', 'mandiri-role'),
    ('Di mana Hari kuliah teknik informatika?', 'about'),
    ('Pernah mengembangkan micro frontend modular?', 'bluebird'),
    ('Apa skill backend Hari?', 'backend'),
    ('Apa project tracking kendaraan?', 'ufm'),
]

def main():
    correct = 0
    for question, expected in CASES:
        docs, mode = retrieve_hybrid(question, DATA)
        ids = [d['id'] for d in docs]
        hit = expected in ids
        correct += hit
        print(('PASS' if hit else 'REVIEW'), f'[{mode}]', question)
        print('  expected:', expected, 'retrieved:', ', '.join(ids))
    print(f'\nRecall@4 on {len(CASES)} handpicked questions: {correct}/{len(CASES)}')
    print('This measures evidence retrieval only, not hallucination, security or answer quality.')

if __name__ == '__main__':
    main()
