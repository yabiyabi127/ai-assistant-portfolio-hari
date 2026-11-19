import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "../styles/ai.css";

const API_URL = (import.meta.env.VITE_AI_API_URL || "/api").replace(/\/$/, "");
const quickQuestions = [
  "Apa pengalaman kerja Hari?",
  "Skill frontend apa saja?",
  "Project yang pernah dibuat?",
  "Di mana Hari kuliah?",
];
const initialMessages = [
  {
    role: "assistant",
    text: "Halo! 👋 Saya asisten portfolio Hari. Kamu bisa bertanya tentang pengalaman, skill, pendidikan, atau project Hari.",
  },
];

export default function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const listEnd = useRef(null);
  const inputEl = useRef(null);
  const controller = useRef(null);

  useEffect(() => {
    if (open) {
      listEnd.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      inputEl.current?.focus();
    }
  }, [open, messages, loading]);
  useEffect(() => {
    if (!open) return;
    const keyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", keyDown);
    return () => document.removeEventListener("keydown", keyDown);
  }, [open]);
  useEffect(() => () => controller.current?.abort(), []);

  const send = async (text) => {
    const message = (text ?? input).trim();
    if (!message || loading || message.length > 600) return;
    setOpen(true);
    setInput("");
    setStatus("");
    setMessages((prev) => [...prev, { role: "user", text: message }]);
    setLoading(true);
    const ac = new AbortController();
    controller.current = ac;
    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          history: messages
            .filter((m) => m.role === "user" || m.role === "assistant")
            .slice(1)
            .slice(-8)
            .map((m) => ({ role: m.role, content: m.text.slice(0, 600) })),
        }),
        signal: ac.signal,
      });
      if (!response.ok) throw new Error(`API ${response.status}`);
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.answer || "Tidak ada jawaban.",
          sources: Array.isArray(data.sources) ? data.sources : [],
          mode: data.mode,
        },
      ]);
    } catch (error) {
      if (error.name === "AbortError") return;
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Maaf, server AI belum bisa dihubungi. Pastikan backend FastAPI sudah berjalan di port 8000, lalu coba lagi.",
        },
      ]);
      setStatus("Backend offline atau terjadi kesalahan request.");
    } finally {
      setLoading(false);
      controller.current = null;
    }
  };

  const panel = (
    <section
      className="ai-panel"
      aria-label="AI personal assistant"
      role="dialog"
      aria-modal="false"
    >
      <header className="ai-panel__header">
        <div className="ai-panel__identity">
          <span className="ai-panel__avatar" aria-hidden="true">
            ✦
          </span>
          <span>
            <strong>Ask Hari AI</strong>
            <small>Portfolio personal assistant</small>
          </span>
        </div>
        <button
          type="button"
          className="ai-icon-button"
          onClick={() => setOpen(false)}
          aria-label="Tutup chat"
        >
          ×
        </button>
      </header>
      <div
        className="ai-panel__messages"
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
      >
        {messages.map((m, i) => (
          <div key={i} className={`ai-message ai-message--${m.role}`}>
            <div className="ai-message__bubble">{m.text}</div>
            {m.sources?.length > 0 && (
              <div className="ai-message__sources">
                <span>Sumber:</span>{" "}
                {m.sources.map((s, j) =>
                  s.url ? (
                    <a
                      href={s.url}
                      key={`${s.title}-${j}`}
                      onClick={() => setOpen(false)}
                    >
                      {s.title}
                    </a>
                  ) : (
                    <span
                      key={`${s.title}-${j}`}
                      title="Dokumen sumber tidak dipublikasikan"
                    >
                      {s.title}
                    </span>
                  ),
                )}
              </div>
            )}
          </div>
        ))}
        {messages.length === 1 && (
          <div className="ai-questions">
            {quickQuestions.map((q) => (
              <button key={q} type="button" onClick={() => send(q)}>
                {q}
              </button>
            ))}
          </div>
        )}
        {loading && (
          <div className="ai-typing" aria-label="AI sedang menjawab">
            <i />
            <i />
            <i />
          </div>
        )}
        <div ref={listEnd} />
      </div>
      {status && (
        <p className="ai-panel__status" role="status">
          {status}
        </p>
      )}
      <form
        className="ai-panel__form"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <label className="sr-only" htmlFor="ai-question">
          Tanya tentang Hari
        </label>
        <input
          id="ai-question"
          ref={inputEl}
          value={input}
          maxLength={600}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tanya tentang Hari..."
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Kirim pertanyaan"
        >
          ➤
        </button>
      </form>
      <p className="ai-panel__disclaimer">
        Jawaban berasal dari informasi portfolio; konfirmasi detail penting
        langsung dengan Hari.
      </p>
    </section>
  );

  return createPortal(
    <div className="ai-widget">
      {open && panel}
      <button
        type="button"
        className={`ai-launcher ${open ? "ai-launcher--open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Tutup Ask Hari AI" : "Buka Ask Hari AI"}
      >
        {open ? (
          <span aria-hidden="true">×</span>
        ) : (
          <>
            <span aria-hidden="true">✦</span>
            <span>Ask my AI</span>
          </>
        )}
      </button>
    </div>,
    document.body,
  );
}
