# Hari Personal AI Portfolio — V10.13

Paket ini menggabungkan frontend V10.9.5 dengan backend FastAPI yang diperbarui untuk kualitas RAG, sumber navigasi, fallback, dan riwayat percakapan lokal.

## Frontend
```powershell
npm install
npm run dev
```

## Backend
```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
copy .env.example .env
python -m unittest discover -s tests -v
python -m uvicorn main:app --reload --port 8000
```

Isi `.env` dengan konfigurasi provider milik sendiri. Jangan commit `.env` atau API key.

Jika FAISS belum ada atau knowledge/PDF berubah, jalankan `python build_index.py`.

Frontend menyimpan percakapan aktif pada localStorage browser. Tombol New Chat menghapus percakapan aktif dan memulai sesi baru.


## HR & Recruitment Knowledge

`knowledge.json` now includes the `career` category with Hari's confirmed recruiter-facing information:
- Open to new job opportunities.
- Available to join immediately.
- Flexible about work arrangements.

The chatbot routes recruiter questions such as "kapan Hari bisa gabung?" and "apakah Hari sedang buka untuk lowongan?" to this category. It must not invent salary expectations, notice period, preferred location, or employment type; those details should be discussed directly with Hari.

Because `knowledge.json` changed, rebuild the semantic index after updating:
```powershell
cd backend
python build_index.py
```


## Dynamic knowledge taxonomy (V10.13)

Knowledge is maintained through JSON files; category-specific routing is not hardcoded in `main.py`.

- `backend/knowledge.json`: factual records. Each record uses `id`, `title`, `content`, `url`, and `category`.
- `backend/knowledge_config.json`: category definitions, labels, descriptions, aliases, PDF classification keywords, UI section anchors, broad-question markers, and grounding policy.

To add a category:
1. Add a category definition to `knowledge_config.json` with `label`, `description`, `aliases`, `keywords`, and `section`.
2. Add one or more factual records with that exact `category` value to `knowledge.json`.
3. Optionally add relevant text-based PDFs under `backend/documents/`.
4. Run `python build_index.py` after changing knowledge records or PDFs. Config-only intent/prompt changes do not change embedding vectors, but restart FastAPI to reload the config.

The runtime builds the system prompt from the configured categories. Intent detection uses configured aliases and keywords. Relevant JSON records and PDF chunks can be combined. If a fact is not supported by retrieved context, the assistant must say it is unavailable rather than guess.


### Add a new knowledge category (no `main.py` edit)

Example category entry in `backend/knowledge_config.json`:
```json
"volunteering": {
  "label": "Volunteering",
  "description": "Volunteer and community activities",
  "aliases": ["volunteering", "kegiatan sosial", "relawan"],
  "keywords": ["volunteer", "relawan", "community service"],
  "section": "projects"
}
```
Then add factual records to `backend/knowledge.json` with `"category": "volunteering"`.
Restart FastAPI so it reloads `knowledge_config.json`. Rebuild the FAISS index only when
`knowledge.json` records or PDF files change; config-only aliases/prompt/section changes
do not alter embeddings.


## Personal profile and interview knowledge (V10.13)

New JSON categories:
- `personal`: name, origin, current city/district, birth date/age reference, languages, PC gaming hobbies, personality, and career motivation.
- `software_engineer_interview`: answers grounded in Hari's recorded engineering skills and work.
- `tech_lead_interview`: architecture, technical guidance, mentoring, code review, and collaboration topics.
- `ai_engineering_interview`: the AI Portfolio Assistant architecture and technologies actually used.

All new categories are configured in `knowledge_config.json`; their factual content is stored in `knowledge.json`. No category-specific routing code is added to `main.py`. Interview answers must distinguish general technical explanations from Hari's verified hands-on experience and must not invent metrics, team sizes, employers, or implementation details.

After updating `knowledge.json`, rebuild the semantic index:
```powershell
cd backend
python build_index.py
```


## V10.14 — Streaming Chat & Markdown Rendering

Pembaruan chatbot: 
- Endpoint `POST /chat/stream` mengirim jawaban Groq secara bertahap menggunakan Server-Sent Events (SSE).
- Endpoint lama `POST /chat` tetap tersedia untuk kompatibilitas dan pengujian non-streaming.
- Frontend membaca SSE, menampilkan teks bertahap, cursor animasi, dan tombol Stop Generating.
- Renderer Markdown menampilkan heading, daftar, bold, code, link, dan tabel secara terstruktur tanpa merender HTML mentah.
- System prompt meminta jawaban pengalaman kerja, skill, pendidikan, dan project menggunakan heading/bullet; tabel dihindari kecuali diminta.
- Sources dikirim melalui event metadata dan tetap tersedia sebagai tautan navigasi setelah jawaban selesai.

### Menjalankan

Terminal backend:
```powershell
cd backend
.venv\Scripts\Activate.ps1
python -m uvicorn main:app --reload --port 8000
```

Terminal frontend:
```powershell
npm install
npm run dev
```

Tidak perlu menjalankan `build_index.py` untuk perubahan streaming atau renderer. Jalankan `python build_index.py` hanya ketika sumber yang di-embed (knowledge/dokumen PDF), strategi chunking, atau model embedding berubah.

### Pengujian

```powershell
cd backend
python -m pytest -q
```

Endpoint streaming: `POST http://127.0.0.1:8000/chat/stream` dengan body yang sama seperti `/chat`. Respons menggunakan `text/event-stream`.


## V10.15 — Word-by-word chat streaming

The chat UI now buffers incoming Groq stream chunks and reveals them one word at a time.
This is a presentation queue in React; Groq/backend streaming remains fast and unchanged.

Adjust the typing delay in the frontend `.env` file:
```env
VITE_CHAT_WORD_DELAY_MS=75
```
- `40`: faster
- `75`: natural default
- `100`: slower
- `140`: deliberately slow

Restart the Vite dev server after changing the environment variable. No FAISS/index rebuild is needed.
Stop Generation and New Chat clear the pending word queue.
