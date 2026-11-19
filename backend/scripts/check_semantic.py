"""Manual semantic-search smoke check: python scripts/check_semantic.py."""
"""Run after building index: python test_semantic.py"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from semantic import index_status, search

status = index_status()
print('Index status:', status)
if not status['ready']:
    raise SystemExit('Index belum tersedia. Jalankan: python build_index.py')
queries = [
    'Pernah mengerjakan aplikasi enterprise dengan modul frontend terpisah?',
    'Pengalaman membangun UI untuk bank dengan Angular',
    'Pendidikan universitas Hari di mana?',
]
for question in queries:
    print('\nQUESTION:', question)
    for item in search(question):
        print(f"  {item['score']:.3f} | {item['title']} | {item['url']}")
