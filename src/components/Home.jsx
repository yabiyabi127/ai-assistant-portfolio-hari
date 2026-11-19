import React, { useRef } from "react";

const highlights = [
  {
    icon: "uil uil-brackets-curly",
    label: "Frontend engineering",
    value: "React · Angular · Vue",
  },
  {
    icon: "uil uil-layer-group",
    label: "Architecture",
    value: "Scalable interfaces",
  },
  { icon: "uil uil-robot", label: "Exploring", value: "AI-powered products" },
];

export default function Home() {
  const heroRef = useRef(null);
  const onMove = (event) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    heroRef.current.style.setProperty(
      "--pointer-x",
      `${event.clientX - rect.left}px`,
    );
    heroRef.current.style.setProperty(
      "--pointer-y",
      `${event.clientY - rect.top}px`,
    );
  };
  return (
    <section
      className="home section hero-v92"
      id="home"
      ref={heroRef}
      onPointerMove={onMove}
    >
      <div className="hero-v92__mesh" aria-hidden="true" />
      <div className="container hero-v92__layout">
        <div className="hero-v92__copy">
          <span className="hero-v92__eyebrow">
            <span className="hero-v92__pulse" /> SOFTWARE ENGINEER · INDONESIA
          </span>
          <h1 className="hero-v92__headline">
            Building digital
            <br />
            <span>experiences</span>
            <br />
            that feel alive<span className="hero-v92__period">.</span>
          </h1>
          <p className="hero-v92__lead">
            I'm <strong>Hari Kurniawan</strong>, a full-stack software engineer
            focused on crafting thoughtful web experiences, scalable interfaces,
            and practical AI-powered products.
          </p>
          <div className="hero-v92__actions">
            <a className="button hero-v92__primary" href="#portfolio">
              Explore my work{" "}
              <i className="uil uil-arrow-up-right" aria-hidden="true" />
            </a>
            <a className="hero-v92__secondary" href="#contact">
              Let's connect{" "}
              <i className="uil uil-arrow-right" aria-hidden="true" />
            </a>
          </div>
          <div className="hero-v92__social" aria-label="Social profiles">
            <a
              href="https://www.linkedin.com/in/hari-kurniawan-932050225/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <i className="uil uil-linkedin-alt" />
            </a>
            <a
              href="https://github.com/yabiyabi127"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <i className="uil uil-github-alt" />
            </a>
            <span className="hero-v92__social-label">CONNECT WITH ME</span>
          </div>
        </div>
        <div
          className="hero-v92__visual"
          aria-label="Portrait of Hari Kurniawan"
        >
          <div
            className="hero-v92__orbit hero-v92__orbit--one"
            aria-hidden="true"
          />
          <div
            className="hero-v92__orbit hero-v92__orbit--two"
            aria-hidden="true"
          />
          <div className="hero-v92__photo-wrap">
            <img
              src="/assets/img/fix.png"
              alt="Hari Kurniawan"
              className="hero-v92__portrait"
            />
          </div>
          <div className="hero-v92__floating hero-v92__floating--top">
            <i className="uil uil-code-branch" />{" "}
            <span>
              Engineering
              <br />
              <strong>with purpose</strong>
            </span>
          </div>
          <div className="hero-v92__floating hero-v92__floating--bottom">
            <span className="hero-v92__floating-dot" />{" "}
            <span>
              Open to meaningful
              <br />
              <strong>collaboration</strong>
            </span>
          </div>
          <div className="hero-v92__visual-caption">
            DESIGN × ENGINEERING × AI
          </div>
        </div>
      </div>
      <div className="container hero-v92__bottom">
        <div className="hero-v92__highlights">
          {highlights.map((item) => (
            <div className="hero-v92__highlight" key={item.label}>
              <i className={item.icon} aria-hidden="true" />
              <span>
                <small>{item.label}</small>
                <strong>{item.value}</strong>
              </span>
            </div>
          ))}
        </div>
        <a href="#about" className="hero-v92__scroll">
          SCROLL TO DISCOVER <i className="uil uil-arrow-down" />
        </a>
      </div>
    </section>
  );
}
