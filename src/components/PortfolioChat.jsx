import React, { useEffect, useRef, useState } from "react";
import ChatMarkdown from "./ChatMarkdown.jsx";

const API_URL = (import.meta.env.VITE_AI_API_URL || "/api").replace(/\/$/, "");
// Atur jeda antar kata melalui VITE_CHAT_WORD_DELAY_MS (default 75 ms).
const WORD_DELAY_MS = Math.max(0, Number(import.meta.env.VITE_CHAT_WORD_DELAY_MS || 75));
const suggestions = [
  {
    icon: "uil uil-briefcase-alt",
    label: "Work experience",
    prompt:
      "Ceritakan pengalaman kerja Hari dan kontribusinya di setiap perusahaan.",
  },
  {
    icon: "uil uil-brackets-curly",
    label: "Technical skills",
    prompt:
      "Apa saja skill teknis Hari, terutama frontend, backend, dan AI engineering?",
  },
  {
    icon: "uil uil-brain",
    label: "AI Engineering",
    prompt:
      "Ceritakan project AI Engineering yang sedang dikembangkan Hari dan teknologi yang digunakan.",
  },
  {
    icon: "uil uil-apps",
    label: "Selected projects",
    prompt:
      "Project apa saja yang pernah dikerjakan Hari? Jelaskan beberapa yang paling menarik.",
  },
];

// Mengelola percakapan pengunjung dengan Hari AI.
export default function PortfolioChat({
  seedQuestion,
  onSeedConsumed,
  onNavigate,
  resetVersion = 0,
}) {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("hari-ai-current-conversation-v1");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed.slice(-60) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const endRef = useRef(null);
  const conversationRef = useRef(null);
  const wasNearBottomRef = useRef(true);
  const [showLatest, setShowLatest] = useState(false);
  const inputRef = useRef(null);
  const abortRef = useRef(null);
  const typingQueueRef = useRef([]);
  const typingWorkerRef = useRef(null);
  const typingDoneRef = useRef(false);
  const typingRunIdRef = useRef(0);
  const isEmpty = messages.length === 0;

  useEffect(() => {
    try {
      localStorage.setItem("hari-ai-current-conversation-v1", JSON.stringify(messages.slice(-60)));
    } catch {
      // Penyimpanan lokal dapat tidak tersedia pada mode private tertentu.
    }
  }, [messages]);

  useEffect(() => {
    const conversation = conversationRef.current;
    if (!conversation || !wasNearBottomRef.current) return;
    requestAnimationFrame(() => {
      conversation.scrollTo({
        top: conversation.scrollHeight,
        behavior: "smooth",
      });
    });
  }, [messages, loading]);

  // Tampilkan tombol kembali ke pesan terbaru saat pengguna membaca pesan lama.
  const handleConversationScroll = () => {
    const el = conversationRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    const nearBottom = distance < 90;
    wasNearBottomRef.current = nearBottom;
    setShowLatest(!nearBottom);
  };

  const scrollToLatest = () => {
    const el = conversationRef.current;
    if (!el) return;
    wasNearBottomRef.current = true;
    setShowLatest(false);
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  };
  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);
  useEffect(() => {
    if (seedQuestion) {
      onSeedConsumed?.();
      send(seedQuestion);
    }
  }, [seedQuestion]);
  useEffect(() => {
    if (resetVersion > 0) startNew();
  }, [resetVersion]);
  useEffect(() => () => abortRef.current?.abort(), []);

  // Kirim pertanyaan ke backend AI.
  async function send(raw) {
    const message = (raw ?? input).trim();
    if (!message || loading || message.length > 600) return;
    const prior = messages;
    setInput("");
    setStatus("");
    setMessages((current) => [...current, { role: "user", text: message }]);
    setLoading(true);
    const controller = new AbortController();
    abortRef.current = controller;
    let assistantStarted = false;
    typingRunIdRef.current += 1;
    const currentTypingRun = typingRunIdRef.current;
    typingQueueRef.current = [];
    typingDoneRef.current = false;

    const appendAssistantText = (chunk) => {
      setMessages((current) => current.map((item, index) =>
        index === current.length - 1 && item.role === "assistant"
          ? { ...item, text: item.text + chunk, streaming: true }
          : item
      ));
    };

    const typingWorker = async () => {
      while (currentTypingRun === typingRunIdRef.current &&
        (!typingDoneRef.current || typingQueueRef.current.length > 0)) {
        const next = typingQueueRef.current.shift();
        if (next === undefined) {
          await new Promise((resolve) => setTimeout(resolve, 12));
          continue;
        }
        appendAssistantText(next);
        // Spasi ikut ditampilkan tanpa jeda; jeda hanya setelah token kata.
        if (/\S/.test(next) && !/^\s+$/.test(next)) {
          await new Promise((resolve) => setTimeout(resolve, WORD_DELAY_MS));
        }
      }
    };

    try {
      const response = await fetch(`${API_URL}/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "text/event-stream" },
        body: JSON.stringify({
          message,
          history: prior.slice(-12).map((item) => ({
            role: item.role,
            content: item.text.slice(-1200),
          })),
        }),
        signal: controller.signal,
      });
      if (!response.ok) {
        let detail = "";
        try { detail = (await response.json()).detail || ""; } catch { /* response bukan JSON */ }
        const apiError = new Error(detail || `API ${response.status}`);
        apiError.status = response.status;
        throw apiError;
      }
      if (!response.body) throw new Error("Browser tidak mendukung response streaming.");
      assistantStarted = true;
      setMessages((current) => [...current, { role: "assistant", text: "", sources: [], streaming: true }]);
      typingWorkerRef.current = typingWorker();
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let streamFinished = false;
      const handleEvent = (rawEvent) => {
        const dataLine = rawEvent.split("\n").find((line) => line.startsWith("data:"));
        if (!dataLine) return;
        let event;
        try { event = JSON.parse(dataLine.slice(5).trim()); } catch { return; }
        if (event.type === "meta") {
          setMessages((current) => current.map((item, index) => index === current.length - 1 && item.role === "assistant"
            ? { ...item, sources: event.sources || [], mode: event.mode, retrievalMode: event.retrieval_mode, notice: event.notice || "" }
            : item));
        } else if (event.type === "delta" && event.text) {
          // Pecah potongan dari Groq menjadi token kata agar UI mengetik lebih natural.
          const tokens = event.text.match(/\s+|\S+/g) || [];
          typingQueueRef.current.push(...tokens);
        } else if (event.type === "done") {
          streamFinished = true;
          setMessages((current) => current.map((item, index) => index === current.length - 1 && item.role === "assistant"
            ? { ...item, streaming: false, notice: event.notice || item.notice || "" }
            : item));
        }
      };
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");
        const events = buffer.split("\n\n");
        buffer = events.pop() || "";
        events.forEach(handleEvent);
      }
      buffer += decoder.decode();
      if (buffer.trim()) handleEvent(buffer);
      typingDoneRef.current = true;
      await typingWorkerRef.current;
      typingWorkerRef.current = null;
      setMessages((current) => current.map((item, index) => index === current.length - 1 && item.role === "assistant"
        ? { ...item, streaming: false }
        : item));
    } catch (error) {
      if (error.name === "AbortError") {
        typingQueueRef.current = [];
        typingDoneRef.current = true;
        setMessages((current) => current.map((item, index) => index === current.length - 1 && item.role === "assistant"
          ? { ...item, streaming: false, notice: item.text ? "Generasi dihentikan." : item.notice }
          : item));
        return;
      }
      if (assistantStarted) {
        setMessages((current) => current.map((item, index) => index === current.length - 1 && item.role === "assistant"
          ? { ...item, streaming: false, notice: "Koneksi terputus saat menerima jawaban. Coba lanjutkan dengan pertanyaan baru." }
          : item));
      } else {
        setMessages((current) => [...current, {
          role: "assistant",
          text: "Maaf, server AI belum bisa dihubungi. Pastikan backend FastAPI berjalan di port 8000, lalu coba lagi.",
        }]);
      }
      if (error.status === 429) {
        setStatus("Terlalu banyak pertanyaan dalam waktu singkat. Tunggu sebentar lalu coba lagi.");
      } else if (error.status === 422) {
        setStatus("Pertanyaan atau riwayat percakapan tidak sesuai batas yang diizinkan.");
      } else if (error.status >= 500) {
        setStatus("Backend sedang mengalami kendala. Coba lagi beberapa saat.");
      } else {
        setStatus("Koneksi ke AI belum tersedia. Pastikan backend FastAPI berjalan.");
      }
    } finally {
      typingDoneRef.current = true;
      typingQueueRef.current = [];
      setLoading(false);
      abortRef.current = null;
    }
  }

  // Hentikan stream yang sedang berjalan.
  const stopGeneration = () => {
    typingRunIdRef.current += 1;
    typingQueueRef.current = [];
    typingDoneRef.current = true;
    abortRef.current?.abort();
    setLoading(false);
  };

  // Mulai percakapan baru.
  const startNew = () => {
    typingRunIdRef.current += 1;
    typingQueueRef.current = [];
    typingDoneRef.current = true;
    abortRef.current?.abort();
    setMessages([]);
    try { localStorage.removeItem("hari-ai-current-conversation-v1"); } catch { /* abaikan */ }
    setInput("");
    setStatus("");
    setLoading(false);
    inputRef.current?.focus();
  };

  return (
    <section
      className={`chat-home ${isEmpty ? "is-empty" : "has-messages"}`}
      aria-label="Ask Hari AI"
    >
      <div className="chat-topline">
        <span className="chat-model-pill">
          <span className="model-spark">✳</span> HARI AI{" "}
          <span className="model-divider" /> PERSONAL KNOWLEDGE ASSISTANT
        </span>
        <button onClick={startNew} className="chat-new-button">
          <i className="uil uil-redo" /> New chat
        </button>
      </div>

      {isEmpty ? (
        <>
          <div className="chat-intro-shell ambient-scene">
            <div className="chat-welcome">
              <div className="welcome-orb">
                <span>h.</span>
                <i className="orb-dot orb-dot-a" />
                <i className="orb-dot orb-dot-b" />
              </div>
              <p className="welcome-kicker">YOUR INTERACTIVE PORTFOLIO GUIDE</p>
              <h1>
                Hi, I'm Hari.
                <br />
                <span>Ask me anything.</span>
              </h1>
              <p className="welcome-description">
                Explore my journey as a Software Engineer, discover the projects
                I've built, or ask about my hands-on journey into AI
                Engineering.
              </p>
              <div className="suggestion-grid">
                {suggestions.map((item) => (
                  <button
                    className="suggestion-card"
                    key={item.label}
                    onClick={() => send(item.prompt)}
                  >
                    <span className="suggestion-icon">
                      <i className={item.icon} />
                    </span>
                    <span>
                      <strong>{item.label}</strong>
                      <small>{item.prompt}</small>
                    </span>
                    <i className="uil uil-arrow-up-right suggestion-arrow" />
                  </button>
                ))}
              </div>
              <div className="welcome-direct-links">
                <span>Or explore directly</span>
                <button onClick={() => onNavigate("about")}>
                  About Hari <i className="uil uil-arrow-up-right" />
                </button>
                <button onClick={() => onNavigate("ai-engineering")}>
                  AI Engineering <i className="uil uil-arrow-up-right" />
                </button>
                <button onClick={() => onNavigate("projects")}>
                  Projects <i className="uil uil-arrow-up-right" />
                </button>
              </div>
            </div>

            <div className="chat-composer-wrap intro-composer-wrap">
              {status && (
                <p className="chat-status" role="status">
                  {status}
                </p>
              )}
              <form
                className="chat-composer"
                onSubmit={(event) => {
                  event.preventDefault();
                  send();
                }}
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  maxLength={600}
                  rows={1}
                  placeholder="Ask anything about Hari's experience, skills, or projects..."
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      send();
                    }
                  }}
                />
                <div className="composer-bottom">
                  <span>
                    <i className="uil uil-shield-check" /> Answers grounded in
                    portfolio knowledge
                  </span>
                  {loading ? (
                    <button type="button" className="stop-generation-button" onClick={stopGeneration} aria-label="Stop generating">
                      <i className="uil uil-square" />
                    </button>
                  ) : (
                    <button type="submit" disabled={!input.trim()} aria-label="Send message">
                      <i className="uil uil-arrow-up" />
                    </button>
                  )}
                </div>
              </form>
              <p className="composer-disclaimer">
                Hari AI can make mistakes. For important details, please verify
                with Hari directly.
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            className="chat-conversation"
            ref={conversationRef}
            onScroll={handleConversationScroll}
            role="log"
            aria-live="polite"
          >
            <div className="conversation-heading">
              <span>CONVERSATION</span>
              <small>Ask follow-up questions to explore more</small>
            </div>
            {messages.map((message, index) => (
              <article
                className={`conversation-message ${message.role}`}
                key={`${index}-${message.role}`}
              >
                <div className="message-avatar">
                  {message.role === "assistant" ? "h." : "You"}
                </div>
                <div className="message-content">
                  <div className="message-author">
                    {message.role === "assistant" ? "Hari AI" : "You"}
                  </div>
                  <ChatMarkdown content={message.text} />
                  {message.streaming && <span className="streaming-caret" aria-label="AI sedang menulis" />}
                  {message.notice && <small className="chat-status" role="status">{message.notice}</small>}
                  {message.sources?.length > 0 && (
                    <div className="message-sources">
                      <span>Sources</span>
                      {message.sources.map((source, i) => {
                        const target = source.section_url || source.url || "/#about";
                        const isPdf = source.source_type === "pdf" &&
                          typeof source.url === "string" && source.url.startsWith("/assets/pdf/");
                        const rawSection = source.section || target.split("#")[1] || "about";
                        const section = rawSection.replace(/^\//, "").toLowerCase();
                        const sectionMap = { portfolio: "projects", profile: "about", tech: "skills", courses: "education" };
                        const view = sectionMap[section] || section;
                        return isPdf ? (
                          <a
                            key={`${source.title}-${i}`}
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <i className="uil uil-file-pdf" />
                            {source.title}
                            {source.page ? ` · p.${source.page}` : ""}
                          </a>
                        ) : (
                          <button
                            type="button"
                            key={`${source.title}-${i}`}
                            onClick={() => onNavigate?.(view)}
                            title={`Buka bagian ${view}`}
                          >
                            <i className="uil uil-location-arrow" />
                            {source.title}
                            <i className="uil uil-arrow-up-right source-jump-icon" />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </article>
            ))}
            {loading && !messages.some((item) => item.role === "assistant" && item.streaming) && (
              <div className="conversation-message assistant">
                <div className="message-avatar">h.</div>
                <div className="message-content">
                  <div className="message-author">Hari AI</div>
                  <div className="typing-indicator">
                    <i />
                    <i />
                    <i /> <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            {showLatest && (
              <button
                type="button"
                className="conversation-latest-button"
                onClick={scrollToLatest}
              >
                <i className="uil uil-arrow-down" /> Latest message
              </button>
            )}
            <div ref={endRef} />
          </div>

          <div className="chat-composer-wrap">
            {status && (
              <p className="chat-status" role="status">
                {status}
              </p>
            )}
            <form
              className="chat-composer"
              onSubmit={(event) => {
                event.preventDefault();
                send();
              }}
            >
              <textarea
                ref={inputRef}
                value={input}
                maxLength={600}
                rows={1}
                placeholder="Ask anything about Hari's experience, skills, or projects..."
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    send();
                  }
                }}
              />
              <div className="composer-bottom">
                <span>
                  <i className="uil uil-shield-check" /> Answers grounded in
                  portfolio knowledge
                </span>
                {loading ? (
                  <button type="button" className="stop-generation-button" onClick={stopGeneration} aria-label="Stop generating">
                    <i className="uil uil-square" />
                  </button>
                ) : (
                  <button type="submit" disabled={!input.trim()} aria-label="Send message">
                    <i className="uil uil-arrow-up" />
                  </button>
                )}
              </div>
            </form>
            <p className="composer-disclaimer">
              Hari AI can make mistakes. For important details, please verify
              with Hari directly.
            </p>
          </div>
        </>
      )}
    </section>
  );
}
