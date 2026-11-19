"""Unified backend regression suite.

Run from the backend directory:
    python -m unittest discover -s tests -v
"""
import sys
from pathlib import Path
BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))



# Tests consolidated from test_v8.py
import json
import unittest
from pathlib import Path
from hybrid import lexical_rank, retrieve_hybrid

DATA = json.loads((BACKEND_DIR / 'knowledge.json').read_text(encoding='utf-8'))

class HybridTests(unittest.TestCase):
    def test_mandiri_angular_lexical(self):
        docs = lexical_rank('Pengalaman membangun UI bank dengan Angular', DATA)
        self.assertEqual(docs[0]['id'], 'mandiri-role')

    def test_keyword_fallback(self):
        docs, mode = retrieve_hybrid('Angular Bank Mandiri', DATA, semantic_fn=lambda *a, **kw: None)
        self.assertEqual(mode, 'keyword')
        self.assertEqual(docs[0]['id'], 'mandiri-role')

    def test_fusion(self):
        byid = {d['id']: d for d in DATA}
        def fake_semantic(*a, **kw):
            return [byid['bluebird'], byid['mandiri-role']]
        docs, mode = retrieve_hybrid('React micro frontend Blue Bird', DATA, semantic_fn=fake_semantic)
        self.assertEqual(mode, 'hybrid')
        self.assertIn('bluebird', [d['id'] for d in docs[:3]])

    def test_unrelated_keyword_has_no_hits(self):
        self.assertFalse(lexical_rank('quasarzz flumptiouszz', DATA))


class ApiTests(unittest.TestCase):
    def test_private_question_blocked_without_provider(self):
        from fastapi.testclient import TestClient
        import main
        main._requests.clear()
        response = TestClient(main.app).post('/chat', json={'message': 'Berapa gaji terakhir Hari?'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['mode'], 'policy')
        self.assertEqual(response.json()['sources'], [])

    def test_excessively_long_message_rejected(self):
        from fastapi.testclient import TestClient
        import main
        response = TestClient(main.app).post('/chat', json={'message':'x' * 601})
        self.assertEqual(response.status_code, 422)

    def test_health_does_not_leak_key(self):
        from fastapi.testclient import TestClient
        import main
        response = TestClient(main.app).get('/health')
        self.assertEqual(response.status_code, 200)
        self.assertNotIn('api_key', response.text.lower())


# Tests consolidated from test_v9.py
import unittest
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch

from document_loader import load_documents, data_fingerprint, make_pdf_chunks
from hybrid import retrieve_hybrid
from semantic import index_status

class DocumentIntegrationTests(unittest.TestCase):
    def test_json_and_pdf_both_loaded(self):
        docs=load_documents()
        self.assertTrue(any(d['source_type']=='json' for d in docs))
        pdf=[d for d in docs if d['source_type']=='pdf']
        self.assertTrue(pdf)
        self.assertTrue(any('Prudential' in d['content'] for d in pdf))
        self.assertTrue(all(d.get('page')==1 for d in pdf))

    def test_contact_identifiers_not_in_retrieval(self):
        text=' '.join(d['content'] for d in load_documents() if d['source_type']=='pdf')
        self.assertNotIn('082118301993', text)
        self.assertNotIn('hariniawadev@gmail.com', text)
        self.assertNotIn('kurniawan127/', text)

    def test_pdf_keyword_fallback(self):
        docs,mode=retrieve_hybrid('Prudential PRUforce React Native',load_documents(),semantic_fn=lambda *a,**kw:None)
        self.assertEqual(mode,'keyword')
        self.assertTrue(any(d.get('source_type')=='pdf' for d in docs))

    def test_fingerprint_changes_when_pdf_bytes_change(self):
        from document_loader import ROOT, DOCUMENTS_DIR
        original=data_fingerprint()
        with TemporaryDirectory() as temp:
            new=Path(temp)/'example.pdf'
            new.write_bytes(b'PDF TEST')
            # Only patch source listing for fingerprint; do not parse invalid PDF.
            with patch('document_loader.DOCUMENTS_DIR',Path(temp)):
                new_digest=data_fingerprint()
        self.assertNotEqual(original,new_digest)

    def test_api_reports_sources(self):
        from fastapi.testclient import TestClient
        from main import app
        health=TestClient(app).get('/health').json()
        self.assertGreater(health['sources']['pdf_chunks'],0)
        self.assertGreater(health['sources']['json'],0)
        self.assertIn(health['semantic']['reason'], (None, 'index_missing', 'index_outdated'))



# Tests consolidated from test_v91.py
import unittest
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch

import pymupdf

from document_loader import (
    make_pdf_chunks, load_documents, data_fingerprint, _reading_order
)


class GeneralPDFTests(unittest.TestCase):
    def _pdf(self, destination, *, layout):
        pdf = pymupdf.open()
        page = pdf.new_page(width=595, height=842)
        if layout == "single":
            page.insert_text((45, 60), "PROJECT APOLLO ARCHITECTURE", fontsize=14)
            page.insert_textbox(pymupdf.Rect(45, 95, 530, 400),
                "Built a software platform for logistics. Used FastAPI, React and PostgreSQL. " * 3, fontsize=11)
        if layout == "two":
            page.insert_text((45, 35), "MULTI-COLUMN PROJECT REPORT", fontsize=14)
            page.insert_textbox(pymupdf.Rect(45, 80, 272, 530),
                "LEFTCOLUMN unique-L-100. React dashboard for route planning.\n" * 5, fontsize=11)
            page.insert_textbox(pymupdf.Rect(315, 80, 550, 530),
                "RIGHTCOLUMN unique-R-200. Backend FastAPI and PostgreSQL.\n" * 5, fontsize=11)
        if layout == "three":
            for i, x in enumerate((40, 225, 410)):
                page.insert_text((x, 80), f"COLUMN_{i+1}_UNIQUE", fontsize=10)
                page.insert_text((x, 115), f"detail_{i+1}_persisted", fontsize=9)
        if layout == "scan":
            page.draw_rect(pymupdf.Rect(40, 40, 250, 250), fill=(.4,.4,.4))
        pdf.save(str(destination))
        pdf.close()
        return destination

    def test_single_column_project_pdf(self):
        with TemporaryDirectory() as temp:
            p = self._pdf(Path(temp)/"project.pdf", layout="single")
            chunks = make_pdf_chunks(p)
        combined = " ".join(d["content"] for d in chunks)
        self.assertIn("PROJECT APOLLO", combined)
        self.assertIn("PostgreSQL", combined)
        self.assertTrue(all(d["page"] == 1 for d in chunks))

    def test_two_column_text_not_dropped(self):
        with TemporaryDirectory() as temp:
            p = self._pdf(Path(temp)/"columns.pdf", layout="two")
            chunks = make_pdf_chunks(p)
        body = " ".join(d["content"] for d in chunks)
        self.assertIn("LEFTCOLUMN unique-L-100", body)
        self.assertIn("RIGHTCOLUMN unique-R-200", body)
        self.assertIn("MULTI-COLUMN PROJECT REPORT", body)

    def test_three_column_text_not_dropped(self):
        with TemporaryDirectory() as temp:
            p = self._pdf(Path(temp)/"columns3.pdf", layout="three")
            body = " ".join(d["content"] for d in make_pdf_chunks(p))
        for i in range(1,4):
            self.assertIn(f"COLUMN_{i}_UNIQUE",body)
            self.assertIn(f"detail_{i}_persisted",body)

    def test_image_only_file_explicit_error(self):
        with TemporaryDirectory() as temp:
            p = self._pdf(Path(temp)/"scan.pdf", layout="scan")
            with self.assertRaisesRegex(ValueError, "No selectable text"):
                make_pdf_chunks(p)

    def test_multiple_pdfs_and_json_loaded(self):
        with TemporaryDirectory() as temp:
            folder = Path(temp)
            self._pdf(folder / "project.pdf",layout="single")
            self._pdf(folder / "columns.pdf",layout="two")
            with patch('document_loader.DOCUMENTS_DIR', folder):
                docs = load_documents()
                self.assertNotEqual(data_fingerprint(), "")
        names = {d["source_file"] for d in docs}
        self.assertGreaterEqual(len(names), 3)
        self.assertTrue({"knowledge.json", "project.pdf", "columns.pdf"} <= names)

    def test_unpublished_files_do_not_get_public_url(self):
        with TemporaryDirectory() as temp:
            p=self._pdf(Path(temp)/"personal-notes.pdf",layout="single")
            chunks=make_pdf_chunks(p)
        self.assertTrue(all(d['url'] is None for d in chunks))

    def test_existing_cv_still_extracts_prudential(self):
        docs=load_documents()
        pdf=[d for d in docs if d['source_type']=='pdf']
        self.assertTrue(any('Prudential' in d['content'] for d in pdf))
        self.assertTrue(all(d['page']>=1 for d in pdf))



# Tests consolidated from test_category_retrieval.py
import unittest
from main import DATA, detect_category_intent, retrieve_by_category


class CategoryRetrievalTests(unittest.TestCase):
    def test_detects_supported_categories(self):
        cases = {
            "Sebutkan semua pengalaman kerja Hari": "experience",
            "Ceritakan pengalaman kerja dan kontribusinya di setiap perusahaan": "experience",
            "Hari berasal dari mana?": "profile",
            "Apa saja skill yang dikuasai?": "skills",
            "Tampilkan semua project Hari": "projects",
            "Bagaimana pendidikan Hari?": "education",
            "Apa sertifikasi Hari?": "certifications",
        }
        for query, expected in cases.items():
            with self.subTest(query=query):
                self.assertEqual(detect_category_intent(query), expected)

    def test_returns_all_structured_items(self):
        for category in ("experience", "skills", "projects", "education"):
            with self.subTest(category=category):
                docs = retrieve_by_category(category, DATA)
                self.assertTrue(docs)
                self.assertTrue(all(doc.get("category") == category for doc in docs))

    def test_category_items_are_not_limited_to_top_four(self):
        self.assertGreater(len(retrieve_by_category("experience", DATA)), 3)
        self.assertGreater(len(retrieve_by_category("projects", DATA)), 4)

    def test_certifications_fall_back_when_no_structured_data_exists(self):
        self.assertEqual(retrieve_by_category("certifications", DATA), [])


if __name__ == "__main__":
    unittest.main()


class SourceAndFallbackTests(unittest.TestCase):
    def test_source_payload_has_section_url(self):
        from main import build_sources
        sources = build_sources([next(d for d in DATA if d["id"] == "prudential-role")])
        self.assertEqual(sources[0]["section_url"], "/#experience")
        self.assertEqual(sources[0]["section"], "experience")

    def test_ai_engineering_source_keeps_specific_anchor(self):
        from main import build_sources
        doc = next(d for d in DATA if d["id"] == "ai-portfolio-assistant-project")
        self.assertEqual(build_sources([doc])[0]["section_url"], "/#ai-engineering")

    def test_category_retrieval_includes_all_experience_json(self):
        from main import retrieve_by_category
        docs = retrieve_by_category("experience", DATA, "Ceritakan pengalaman di setiap perusahaan")
        ids = {d["id"] for d in docs}
        self.assertTrue({"prudential-role", "bluebird", "mandiri-role", "beacukai-role"}.issubset(ids))

    def test_fallback_contains_all_selected_documents(self):
        from main import fallback_answer
        docs = [d for d in DATA if d.get("category") == "experience"]
        answer = fallback_answer(docs)
        for doc in docs:
            self.assertIn(doc["title"], answer)

class LLMOutputTests(unittest.TestCase):
    def test_retries_when_provider_reports_output_length(self):
        from unittest.mock import patch, MagicMock
        import os
        import main

        first = MagicMock()
        first.json.return_value = {"choices": [{"message": {"content": "jawaban belum selesai"}, "finish_reason": "length"}]}
        second = MagicMock()
        second.json.return_value = {"choices": [{"message": {"content": "jawaban lengkap"}, "finish_reason": "stop"}]}

        client = MagicMock()
        client.__enter__.return_value = client
        client.__exit__.return_value = False
        client.post.side_effect = [first, second]
        with patch.dict(os.environ, {"LLM_API_KEY": "test-key", "LLM_BASE_URL": "https://api.groq.com/openai/v1"}), patch.object(main.httpx, "Client", return_value=client):
            answer, finish_reason = main.call_llm("Ceritakan pengalaman Hari", [{"title": "Experience", "content": "Detail"}], [])
        self.assertEqual(answer, "jawaban lengkap")
        self.assertEqual(finish_reason, "stop")
        self.assertEqual(client.post.call_count, 2)
        self.assertEqual(client.post.call_args_list[0].kwargs["json"]["max_tokens"], 1800)
        self.assertEqual(client.post.call_args_list[1].kwargs["json"]["max_tokens"], 3200)


class CareerAvailabilityTests(unittest.TestCase):
    def test_hr_questions_route_to_career_category(self):
        from main import DATA, detect_category_intent, is_broad_request, retrieve_by_category
        questions = (
            "Saya HRD, kapan Hari bisa gabung?",
            "Apakah Hari sedang buka untuk lowongan?",
            "Apakah Hari open untuk peluang kerja?",
        )
        for question in questions:
            with self.subTest(question=question):
                category = detect_category_intent(question)
                self.assertEqual(category, "career")
                self.assertTrue(is_broad_request(question, category))
                docs = retrieve_by_category(category, DATA, question)
                self.assertTrue(any(doc.get("id") == "career-availability" for doc in docs))

    def test_career_record_contains_only_confirmed_facts(self):
        from main import DATA
        record = next(d for d in DATA if d.get("id") == "career-availability")
        content = record["content"].casefold()
        self.assertIn("open to new job opportunities", content)
        self.assertIn("available to join immediately", content)
        self.assertIn("flexible", content)
        self.assertNotIn("salary", content)
        self.assertNotIn("notice period", content)


class DynamicKnowledgeConfigTests(unittest.TestCase):
    def test_category_intents_are_loaded_from_json_config(self):
        from main import CATEGORY_CONFIG, detect_category_intent, is_broad_request
        self.assertIn("career", CATEGORY_CONFIG)
        self.assertEqual(detect_category_intent("Apakah Hari bisa join segera?"), "career")
        self.assertEqual(detect_category_intent("Apa saja keahlian Hari?"), "skills")
        self.assertTrue(is_broad_request("Ceritakan semua tentang pengalaman Hari", "experience"))

    def test_new_category_can_be_added_without_main_code_changes(self):
        from main import CATEGORY_CONFIG, detect_category_intent
        # Simulate a category added to the JSON taxonomy at runtime.
        CATEGORY_CONFIG["volunteering"] = {
            "label": "Volunteering",
            "description": "Community work",
            "aliases": ["volunteering", "kegiatan sosial"],
            "keywords": ["relawan", "sukarelawan"],
            "section": "projects"
        }
        self.assertEqual(detect_category_intent("Apa kegiatan sosial Hari?"), "volunteering")
        del CATEGORY_CONFIG["volunteering"]

    def test_system_prompt_lists_configured_categories(self):
        from main import build_system_prompt, CATEGORY_CONFIG
        prompt = build_system_prompt()
        for category, spec in CATEGORY_CONFIG.items():
            self.assertIn(category, prompt)
            self.assertIn(spec.get("label", category), prompt)

    def test_unknown_personal_facts_are_not_asserted_by_policy(self):
        from main import SYSTEM_PROMPT
        self.assertIn("Never invent", SYSTEM_PROMPT)
        self.assertIn("not available in the portfolio", SYSTEM_PROMPT)

    def test_pdf_category_inference_uses_json_taxonomy(self):
        from main import infer_pdf_category
        doc = {"title": "Volunteer Activities", "content": "Volunteer work and community activities with volunteers"}
        # No matching configured category: falls back to configured default.
        self.assertEqual(infer_pdf_category(doc), "profile")


class PersonalAndInterviewKnowledgeTests(unittest.TestCase):
    def test_personal_identity_category_is_configured_and_retrievable(self):
        from main import CATEGORY_CONFIG, detect_category_intent, retrieve_by_category, DATA
        self.assertIn("personal", CATEGORY_CONFIG)
        self.assertEqual(detect_category_intent("Apa hobi Hari?"), "personal")
        docs = retrieve_by_category("personal", DATA, "Apa hobi dan domisili Hari?")
        self.assertTrue(any(d.get("id") == "personal-background" for d in docs))

    def test_interview_tracks_are_dynamic_categories(self):
        from main import CATEGORY_CONFIG, detect_category_intent
        self.assertIn("tech_lead_interview", CATEGORY_CONFIG)
        self.assertIn("software_engineer_interview", CATEGORY_CONFIG)
        self.assertIn("ai_engineering_interview", CATEGORY_CONFIG)
        self.assertEqual(detect_category_intent("Pertanyaan tech lead interview"), "tech_lead_interview")
        self.assertEqual(detect_category_intent("Persiapan interview AI engineer"), "ai_engineering_interview")
        self.assertEqual(detect_category_intent("Software engineer technical interview"), "software_engineer_interview")

    def test_interview_answers_are_grounded_in_existing_skills_and_projects(self):
        from main import DATA, retrieve_by_category
        ai_docs = retrieve_by_category("ai_engineering_interview", DATA, "Jelaskan RAG dan FAISS di project Hari")
        self.assertTrue(any(d.get("id") == "interview-ai-engineering" for d in ai_docs))
