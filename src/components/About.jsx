import React from "react";

const highlights = [
  { value: "5+", label: "Years in software development" },
  { value: "4", label: "Professional roles in latest CV" },
  { value: "3", label: "Core areas: frontend, backend & AI" },
];

const focus = [
  {
    icon: "uil uil-window",
    title: "Frontend engineering",
    text: "Building responsive interfaces, reusable components, and maintainable web applications.",
  },
  {
    icon: "uil uil-server-network",
    title: "Full-stack development",
    text: "Connecting user experiences with APIs, backend services, and relational databases.",
  },
  {
    icon: "uil uil-brain",
    title: "Applied AI engineering",
    text: "Learning by building an AI portfolio assistant with Python, FastAPI, RAG, embeddings, and document retrieval.",
  },
];

export default function About() {
  return (
    <section className="about-modern" aria-label="About Hari Kurniawan">
      <div className="about-modern-hero">
        <div className="about-modern-copy">
          <span className="about-modern-kicker">A LITTLE ABOUT ME</span>
          <h2>
            Engineering thoughtful
            <br />
            <span>digital experiences.</span>
          </h2>
          <p className="about-modern-lead">
            I’m Hari Kurniawan, a Software Engineer specializing in frontend and
            full-stack development, with experience building web and mobile
            applications.
          </p>
          <p className="about-modern-description">
            With 5+ years of experience, I have contributed to internal
            platforms and business applications across multiple teams. My work
            includes developing reusable interfaces, integrating REST APIs,
            building micro-frontend modules, and supporting production
            applications. I have also taken on frontend leadership
            responsibilities, including technical guidance, mentoring, and code
            reviews. Alongside my professional work, I am expanding into applied
            AI engineering by building a portfolio assistant powered by Python,
            FastAPI, LLMs, and RAG.
          </p>
          <div className="about-modern-actions">
            <a
              className="workspace-primary-button"
              href="/assets/pdf/Hari-Kurniawan-CV-2026.pdf"
              download
            >
              Download CV <i className="uil uil-download-alt" />
            </a>
            <span className="about-location">
              <i className="uil uil-map-marker" /> Jakarta, Indonesia
            </span>
          </div>
        </div>
        <div className="about-modern-portrait-wrap">
          <div className="about-portrait-orbit about-portrait-orbit-one" />
          <div className="about-portrait-orbit about-portrait-orbit-two" />
          <img
            className="about-modern-portrait"
            src="/assets/img/hari-profile-new.png"
            alt="Hari Kurniawan"
          />
          <div className="about-portrait-caption">
            <span className="status-pulse" /> Open to opportunities
          </div>
        </div>
      </div>

      <div className="about-stats-grid">
        {highlights.map((item) => (
          <article className="about-stat-card" key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </div>

      <div className="about-focus-section">
        <div className="about-section-heading">
          <span>WHAT I WORK ON</span>
          <h3>From interface to intelligence.</h3>
          <p>
            My experience is rooted in web engineering, with a growing focus on
            practical AI applications.
          </p>
        </div>
        <div className="about-focus-grid">
          {focus.map((item) => (
            <article className="about-focus-card" key={item.title}>
              <span className="about-focus-icon">
                <i className={item.icon} />
              </span>
              <h4>{item.title}</h4>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
