import React, { useEffect, useMemo, useRef, useState } from "react";

const projects = [
  {
    image: "assets/img/project.png",
    title: "PRUforce Mobile Apps",
    category: "Prudential · Mobile Application",
    period: "2025 — Present",
    description:
      "Contributing to the PRUforce mobile experience using React Native, while also building related internal tools with Angular and Ionic. Focused on performance, maintainability, and API-driven business flows.",
    impact: "Cross-platform mobile delivery for insurance operations",
    stack: ["React Native", "Angular", "Ionic", "REST API", "Performance"],
    url: "#experience",
    accent: "accent-pru",
  },
  {
    image: "assets/img/sbs.png",
    title: "Bigbird Platform",
    category: "Blue Bird Group · Internal Platform",
    period: "2023 — 2025",
    description:
      "Operational platform work for internal workflows and transport-related services with a focus on scalable UI structure, reusable modules, and day-to-day engineering collaboration.",
    impact: "Web platform for operational workflow efficiency",
    stack: ["React", "TypeScript", "Vite", ".NET", "UI Components"],
    url: "https://www.figma.com/proto/QOp7XibKlV2LKpE4ybRRsc/School-bus-system?node-id=0-1&t=zslaQDo4SQbvxkN2-1",
    accent: "accent-blue",
  },
  {
    image: "assets/img/modalMandiri.png",
    title: "Peminjaman Modal Bank Mandiri",
    category: "Banking Product",
    period: "2022 — 2024",
    description:
      "Frontend implementation for banking-related interfaces with Angular, reusable component patterns, and API integration to support internal business requirements.",
    impact: "Business-oriented lending workflow interface",
    stack: ["Angular", "TypeScript", "Sass", "REST API"],
    url: "https://pinjamanmodal.bankmandiri.co.id/",
    accent: "accent-mandiri",
  },
  {
    image: "assets/img/bea.png",
    title: "Ceisa 4.0",
    category: "Direktorat Jenderal Bea dan Cukai",
    period: "2020 — 2021",
    description:
      "Worked on internal and digital service features with React, React Native, and Vue.js while collaborating with backend services and enterprise application workflows.",
    impact: "Government service application support",
    stack: ["React", "React Native", "Vue.js", ".NET Core", "SQL Server"],
    url: "https://portal.beacukai.go.id/",
    accent: "accent-customs",
  },
  {
    image: "assets/img/ufm.png",
    title: "Unified Fleet Monitoring",
    category: "Fleet Monitoring Interface",
    period: "Product Interface",
    description:
      "Monitoring dashboard concept and UI work to help visualize and track fleet-related information in a more structured and user-friendly way.",
    impact: "Tracking-focused dashboard experience",
    stack: ["Dashboard UI", "Monitoring", "UX"],
    url: "https://www.figma.com/proto/nkGKCbd1MvX5MubbyIvKd1/UFM?t=zslaQDo4SQbvxkN2-1",
    accent: "accent-fleet",
  },
  {
    image: "assets/img/op.png",
    title: "Operational Platform",
    category: "Internal Management System",
    period: "Product Interface",
    description:
      "Design and implementation work for internal operational flows, helping teams manage employee-related and operational data in a cleaner interface.",
    impact: "Operational management experience",
    stack: ["Internal Tool", "Dashboard", "Operations"],
    url: "https://www.figma.com/proto/m8U44BWsyJQ5fOt5funYlf/Operational?node-id=2-15346&t=zslaQDo4SQbvxkN2-1",
    accent: "accent-ops",
  },
  {
    image: "assets/img/Cover.png",
    title: "UMMI Design System",
    category: "Design System",
    period: "UI/UX Project",
    description:
      "Created a design system framework to make the visual interface more consistent and easier to scale across different pages and product needs.",
    impact: "Consistency and design guidance",
    stack: ["Design System", "Figma", "UI Consistency"],
    url: "https://www.figma.com/design/nFiM8r8fNYPeS8IBEYyeHk/Figma-Universitas-Muhammadiyah-Sukabumi?node-id=37-392&m=dev&t=ZWV8WetezfqhtrwM-1",
    accent: "accent-design",
  },
];

// Ikon arah slider project.
const Arrow = ({ direction }) => (
  <i
    className={`uil ${direction === "prev" ? "uil-angle-left" : "uil-angle-right"}`}
    aria-hidden="true"
  />
);

// Menampilkan project unggulan dalam carousel interaktif.
export default function Portfolio() {
  const [index, setIndex] = useState(0);
  const touchX = useRef(null);
  const dragX = useRef(null);
  const viewRef = useRef(null);
  const reduceMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );
  // Pindah project di slider.
  const move = (direction) =>
    setIndex((i) => (i + direction + projects.length) % projects.length);

  useEffect(() => {
    const node = viewRef.current;
    if (!node) return;
    // Navigasi slider dengan tombol panah.
    const keydown = (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        move(-1);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        move(1);
      }
    };
    node.addEventListener("keydown", keydown);
    return () => node.removeEventListener("keydown", keydown);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % projects.length),
      6500,
    );
    return () => clearInterval(id);
  }, [reduceMotion]);

  // Gerakkan kartu mengikuti cursor.
  const tiltCard = (event) => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      event.pointerType === "touch"
    )
      return;
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    card.style.setProperty("--tilt-x", `${(0.5 - y) * 3.5}deg`);
    card.style.setProperty("--tilt-y", `${(x - 0.5) * 4}deg`);
    card.style.setProperty("--glow-x", `${x * 100}%`);
    card.style.setProperty("--glow-y", `${y * 100}%`);
  };
  // Kembalikan posisi kartu.
  const resetTilt = (event) => {
    const card = event.currentTarget;
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
    card.style.setProperty("--glow-x", "50%");
    card.style.setProperty("--glow-y", "50%");
  };

  // Deteksi geser pada layar sentuh.
  const finishSwipe = (start, end) => {
    if (start === null || end === null) return;
    const delta = start - end;
    if (Math.abs(delta) > 45) move(delta > 0 ? 1 : -1);
  };

  return (
    <section className="portfolio section" id="portfolio">
      <h2 className="section__title">Portfolio</h2>
      <span className="section__subtitle">
        Featured work & product interfaces
      </span>
      <div
        className="portfolio-showcase container"
        ref={viewRef}
        tabIndex={0}
        aria-label="Portfolio projects carousel"
      >
        <div
          className="portfolio-stage"
          onTouchStart={(e) => {
            touchX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            finishSwipe(touchX.current, e.changedTouches[0].clientX);
            touchX.current = null;
          }}
          onMouseDown={(e) => {
            if (e.button === 0 && !e.target.closest("a,button"))
              dragX.current = e.clientX;
          }}
          onMouseUp={(e) => {
            finishSwipe(dragX.current, e.clientX);
            dragX.current = null;
          }}
          onMouseLeave={() => {
            dragX.current = null;
          }}
        >
          <div
            className="portfolio-track"
            style={{ transform: `translate3d(-${index * 100}%, 0, 0)` }}
          >
            {projects.map((project, i) => (
              <article
                key={project.title}
                className={`portfolio-card ${project.accent || ""}`}
                onPointerMove={tiltCard}
                onPointerLeave={resetTilt}
                aria-hidden={i !== index}
                inert={i !== index}
              >
                <div className="portfolio-card__visual">
                  <span className="portfolio-visual-glow" aria-hidden="true" />
                  <img
                    src={project.image}
                    alt={`Preview ${project.title}`}
                    loading={Math.abs(i - index) < 2 ? "eager" : "lazy"}
                    draggable="false"
                  />
                  <div className="portfolio-visual-badges">
                    <span>{project.category}</span>
                    <span>{project.period}</span>
                  </div>
                </div>
                <div className="portfolio-card__body">
                  <div className="portfolio-eyebrow">Selected project</div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="portfolio-impact">
                    <i className="uil uil-bolt-alt" />{" "}
                    <span>{project.impact}</span>
                  </div>
                  <div
                    className="portfolio-stack"
                    aria-label={`Technology stack used in ${project.title}`}
                  >
                    {project.stack.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <div className="portfolio-card__actions">
                    <a
                      href={project.url}
                      className="button button--flex button--small portfolio-card__link"
                      target={
                        project.url.startsWith("#") ? undefined : "_blank"
                      }
                      rel="noopener noreferrer"
                    >
                      View project{" "}
                      <i
                        className="uil uil-arrow-right button__icon"
                        aria-hidden="true"
                      />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="portfolio-controls">
          <button
            type="button"
            className="portfolio-control carousel-arrow-control"
            onClick={() => move(-1)}
            aria-label="Project sebelumnya"
          >
            <Arrow direction="prev" />
          </button>
          <div
            className="portfolio-dots"
            role="group"
            aria-label="Pilih project"
          >
            {projects.map((project, i) => (
              <button
                key={project.title}
                type="button"
                className={`portfolio-dot ${i === index ? "is-active" : ""}`}
                onClick={() => setIndex(i)}
                aria-label={`Tampilkan project ${i + 1}: ${project.title}`}
                aria-current={i === index ? "true" : undefined}
              />
            ))}
          </div>
          <button
            type="button"
            className="portfolio-control carousel-arrow-control"
            onClick={() => move(1)}
            aria-label="Project berikutnya"
          >
            <Arrow direction="next" />
          </button>
        </div>
        <div
          className="portfolio-mini-grid"
          aria-label="Other highlighted projects"
        >
          {projects.map((project, i) => (
            <button
              key={project.title + "-mini"}
              type="button"
              className={`portfolio-mini-card ${i === index ? "is-active" : ""}`}
              onClick={() => setIndex(i)}
            >
              <strong>{project.title}</strong>
              <span>{project.category}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
