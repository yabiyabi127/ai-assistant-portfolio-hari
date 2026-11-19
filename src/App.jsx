import React, { useEffect, useMemo, useState } from "react";
import PortfolioChat from "./components/PortfolioChat.jsx";
import PortfolioSections from "./components/PortfolioSections.jsx";
import "./styles/chat-portfolio.css";

const navigation = [
  {
    id: "chat",
    label: "Ask Hari AI",
    icon: "uil uil-comment-alt-message",
    group: "workspace",
  },
  { id: "about", label: "About me", icon: "uil uil-user", group: "profile" },
  {
    id: "experience",
    label: "Experience",
    icon: "uil uil-briefcase-alt",
    group: "profile",
  },
  {
    id: "ai-engineering",
    label: "AI Engineering",
    icon: "uil uil-brain",
    group: "expertise",
    tag: "NEW",
  },
  {
    id: "skills",
    label: "Tech stack",
    icon: "uil uil-brackets-curly",
    group: "expertise",
  },
  { id: "projects", label: "Projects", icon: "uil uil-apps", group: "work" },
  {
    id: "education",
    label: "Education",
    icon: "uil uil-graduation-cap",
    group: "profile",
  },
  { id: "contact", label: "Contact", icon: "uil uil-envelope", group: "work" },
];

// Mengatur navigasi, tema, dan tampilan utama portfolio.
export default function App() {
  const [activeView, setActiveView] = useState("chat");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(
    () => localStorage.getItem("portfolio-theme") !== "light",
  );
  const [chatSeed, setChatSeed] = useState("");
  const [chatResetVersion, setChatResetVersion] = useState(0);

  const themeClass = dark
    ? "portfolio-shell theme-dark"
    : "portfolio-shell theme-light";

  useEffect(() => {
    if (!sidebarOpen) return;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setSidebarOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [sidebarOpen]);

  // Gerakkan cahaya dan lingkaran mengikuti cursor.
  useEffect(() => {
    const glow = document.getElementById("global-motion-glow");
    const orbitA = document.getElementById("global-motion-orbit-a");
    const orbitB = document.getElementById("global-motion-orbit-b");
    let frame = 0;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;

    const updatePointer = (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (glow) {
          glow.style.background = `radial-gradient(520px circle at ${targetX}px ${targetY}px, rgba(151, 119, 255, .22), transparent 72%)`;
        }
        const moveX = (targetX / window.innerWidth - 0.5) * 2;
        const moveY = (targetY / window.innerHeight - 0.5) * 2;
        if (orbitA)
          orbitA.style.transform = `translate3d(${moveX * 34}px, ${moveY * 26}px, 0) rotate(${moveX * 5}deg)`;
        if (orbitB)
          orbitB.style.transform = `translate3d(${-moveX * 46}px, ${-moveY * 36}px, 0) rotate(${-moveX * 8}deg)`;
      });
    };

    window.addEventListener("pointermove", updatePointer, { passive: true });
    return () => {
      window.removeEventListener("pointermove", updatePointer);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const grouped = useMemo(
    () => ({
      workspace: navigation.filter((item) => item.group === "workspace"),
      profile: navigation.filter((item) => item.group === "profile"),
      expertise: navigation.filter((item) => item.group === "expertise"),
      work: navigation.filter((item) => item.group === "work"),
    }),
    [],
  );

  // Pindah ke menu pilihan.
  const navigate = (id) => {
    setActiveView(id);
    setSidebarOpen(false);
    if (id === "chat") setChatSeed("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Mulai percakapan baru dari tombol sidebar.
  const startNewChat = () => {
    setChatSeed("");
    setChatResetVersion((current) => current + 1);
    setActiveView("chat");
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Kirim pertanyaan awal ke chat.
  const askAI = (question) => {
    setChatSeed(question);
    setActiveView("chat");
    setSidebarOpen(false);
  };

  // Ganti tema website.
  const toggleTheme = () => {
    setDark((current) => {
      localStorage.setItem("portfolio-theme", current ? "light" : "dark");
      return !current;
    });
  };

  return (
    <div className={themeClass}>
      <div className="global-motion-layer" aria-hidden="true">
        <div id="global-motion-glow" className="global-motion-glow" />
        <div
          id="global-motion-orbit-a"
          className="global-motion-orbit orbit-a"
        />
        <div
          id="global-motion-orbit-b"
          className="global-motion-orbit orbit-b"
        />
      </div>
      <div className="workspace-noise" aria-hidden="true" />
      {sidebarOpen && (
        <button
          className="sidebar-backdrop"
          aria-label="Tutup menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        id="portfolio-sidebar"
        className={`workspace-sidebar ${sidebarOpen ? "is-open" : ""}`}
      >
        <button
          className="brand-lockup"
          onClick={() => navigate("chat")}
          aria-label="Kembali ke Ask Hari AI"
        >
          <span className="brand-mark">
            h<span>.</span>
          </span>
          <span className="brand-copy">
            <strong>
              hari<span>.dev</span>
            </strong>
            <small>PERSONAL AI PORTFOLIO</small>
          </span>
        </button>

        <button
          className="sidebar-new-chat"
          onClick={startNewChat}
        >
          <i className="uil uil-plus" /> <span>New conversation</span>
          <kbd>↵</kbd>
        </button>

        <nav className="sidebar-nav" aria-label="Portfolio navigation">
          <span className="sidebar-label">WORKSPACE</span>
          {grouped.workspace.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              active={activeView === item.id}
              onClick={() => navigate(item.id)}
            />
          ))}
          <span className="sidebar-label">PROFILE</span>
          {grouped.profile.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              active={activeView === item.id}
              onClick={() => navigate(item.id)}
            />
          ))}
          <span className="sidebar-label">EXPERTISE</span>
          {grouped.expertise.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              active={activeView === item.id}
              onClick={() => navigate(item.id)}
            />
          ))}
          <span className="sidebar-label">EXPLORE</span>
          {grouped.work.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              active={activeView === item.id}
              onClick={() => navigate(item.id)}
            />
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-status">
            <span className="status-pulse" />{" "}
            <span>AI assistant available</span>
          </div>
          <div className="sidebar-person">
            <img src="/assets/img/fix.png" alt="Hari Kurniawan" />
            <span>
              <strong>Hari Kurniawan</strong>
              <small>Software Engineer</small>
            </span>
            <button
              onClick={toggleTheme}
              aria-label="Ganti tema"
              title="Ganti tema"
            >
              <i className={`uil ${dark ? "uil-sun" : "uil-moon"}`} />
            </button>
          </div>
        </div>
      </aside>

      <main className="workspace-main">
        <header className="workspace-topbar">
          <button
            className="mobile-menu-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Buka menu"
            aria-expanded={sidebarOpen}
            aria-controls="portfolio-sidebar"
          >
            <i className="uil uil-bars" />
          </button>
          <div className="topbar-breadcrumb">
            <span>Portfolio</span>
            <i className="uil uil-angle-right" />
            <strong>
              {navigation.find((item) => item.id === activeView)?.label ||
                "Ask Hari AI"}
            </strong>
          </div>
          <div className="topbar-actions">
            <span className="topbar-availability">
              <span className="status-pulse" /> Available for opportunities
            </span>
            <button
              className="topbar-theme"
              onClick={toggleTheme}
              aria-label="Ganti tema"
            >
              <i className={`uil ${dark ? "uil-sun" : "uil-moon"}`} />
            </button>
          </div>
        </header>

        <div className={`workspace-content ${activeView === "chat" ? "is-chat-view" : ""}`} key={activeView}>
          {activeView === "chat" ? (
            <PortfolioChat
              seedQuestion={chatSeed}
              onSeedConsumed={() => setChatSeed("")}
              onNavigate={navigate}
              resetVersion={chatResetVersion}
            />
          ) : (
            <PortfolioSections view={activeView} onAsk={askAI} />
          )}
        </div>
        <footer className="workspace-footer">
          <span>Designed & built by Hari Kurniawan</span>
          <span>React · FastAPI · RAG · Groq</span>
        </footer>
      </main>
    </div>
  );
}

// Menampilkan satu tombol navigasi sidebar.
// Tampilkan tombol navigasi.
function NavItem({ item, active, onClick }) {
  return (
    <button
      className={`sidebar-nav-item ${active ? "is-active" : ""}`}
      onClick={onClick}
    >
      <i className={item.icon} /> <span>{item.label}</span>
      {item.tag && <em>{item.tag}</em>}
    </button>
  );
}
