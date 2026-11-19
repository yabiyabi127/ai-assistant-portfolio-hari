import React from "react";
import About from "./About.jsx";
import Portfolio from "./Portfolio.jsx";
import Repo from "./Repo.jsx";
import Contact from "./Contact.jsx";
import Skills from "./Skills.jsx";

const experience = [
  {
    company: "PT Prudential Life Assurance",
    role: "Senior Frontend Engineer",
    period: "August 2025 — Present",
    detail:
      "Develop and maintain the PRUforce mobile application with React Native, focusing on performance, stability, and cross-platform compatibility. Build internal web applications with Angular and Ionic, integrate REST APIs, and support Agile delivery, code reviews, production debugging, and releases.",
    stack: ["React Native", "Angular", "Ionic", "REST API", "Agile/Scrum"],
  },
  {
    company: "Blue Bird Group",
    role: "Full-Stack Engineer",
    period: "September 2023 — August 2025",
    detail:
      "Developed responsive internal applications using React, Vite, and TypeScript. Built reusable components and micro-frontend modules, developed .NET APIs, and distributed independently maintained modules through an npm registry while collaborating across engineering teams.",
    stack: [
      "React",
      "Vite",
      "TypeScript",
      ".NET",
      "Micro-Frontend",
      "npm Registry",
    ],
  },
  {
    company: "PT Bank Mandiri (Persero) Tbk",
    role: "Senior Frontend Engineer · Contract",
    period: "January 2022 — August 2024",
    detail:
      "Developed internal applications with Angular, TypeScript, HTML, and Sass. Created reusable UI components and libraries, integrated backend APIs, and improved application responsiveness, accessibility, performance, and maintainability.",
    stack: ["Angular", "TypeScript", "HTML", "Sass", "REST API"],
  },
  {
    company: "Directorate General of Customs and Excise (DJBC)",
    role: "Full-Stack Developer",
    period: "February 2020 — January 2021",
    detail:
      "Developed internal applications and mobile features using React.js, React Native, and Vue.js with Ant Design. Worked with .NET Core and SQL Server, integrated REST APIs, and delivered features and bug fixes tracked through Jira.",
    stack: [
      "React.js",
      "React Native",
      "Vue.js",
      "Ant Design",
      ".NET Core",
      "SQL Server",
      "Jira",
    ],
  },
];
const aiStack = [
  ["Python", "Backend development and document processing"],
  ["FastAPI", "API layer for the AI assistant"],
  ["LLM Integration", "Connecting Groq-hosted language models"],
  ["RAG", "Grounding answers in portfolio knowledge"],
  ["Embeddings", "Converting document chunks into vectors"],
  ["FAISS", "Vector similarity search"],
  ["Hybrid Search", "Combining keyword and semantic retrieval"],
  ["PyMuPDF", "Extracting text from PDF documents"],
  ["Sentence Transformers", "Multilingual embedding model"],
  ["React", "Interactive portfolio and chat interface"],
];
const coreStack = [
  [
    "Frontend",
    "React.js, React Native, Next.js, Angular, Vue.js, Nuxt.js, Flutter, TypeScript, JavaScript (ES6+), HTML5, CSS3, Sass, Tailwind CSS, Bootstrap, Ant Design, Material UI",
  ],
  [
    "Architecture & State Management",
    "Micro-Frontend Architecture, Reusable Components, Nx, Redux, Redux Toolkit (RTK), Zustand, React Query, SSR, CSR, ISR",
  ],
  [
    "Backend & APIs",
    "ASP.NET Core, .NET, Node.js, Express.js, PHP, Laravel, CodeIgniter, REST API Design and Integration",
  ],
  ["Databases", "MySQL, PostgreSQL, SQL Server, MongoDB"],
  [
    "Testing & Delivery",
    "Jest, React Testing Library, Cypress, Git, Jenkins, CI/CD, npm, Verdaccio, Agile/Scrum, Code Review, Production Debugging",
  ],
  [
    "Design & Collaboration",
    "Figma, Jira, UI/UX Implementation, Technical Guidance, Mentoring",
  ],
];
const courses = [
  ["Front-End Web Development", "Udemy", "2021"],
  ["Full-Stack JavaScript Course", "Udemy", "2021"],
  [
    "Full-Stack Web Designer",
    "UI/UX design to HTML, CSS & JavaScript · BuildWithAngga",
    "2021",
  ],
];

export default function PortfolioSections({ view, onAsk }) {
  if (view === "about")
    return (
      <Page
        title="About Hari"
        eyebrow="PROFILE / INTRODUCTION"
        intro="A little context about the person behind the code."
      >
        <About />
      </Page>
    );
  if (view === "experience")
    return (
      <Page
        title="Experience"
        eyebrow="PROFILE / CAREER"
        intro="Professional roles and hands-on engineering work."
      >
        <div className="experience-list">
          {experience.map((item, index) => (
            <article className="experience-card" key={item.company}>
              <div className="experience-index">0{index + 1}</div>
              <div className="experience-card-content">
                <div className="experience-meta">{item.period}</div>
                <h3>{item.role}</h3>
                <h4>{item.company}</h4>
                <p>{item.detail}</p>
                <div
                  className="inline-tags"
                  aria-label={`Technology stack used at ${item.company}`}
                >
                  {item.stack.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
          <article className="experience-card ai-experience-card">
            <div className="experience-index">
              <i className="uil uil-brain" />
            </div>
            <div>
              <div className="experience-meta">
                2026 — ONGOING · PERSONAL PROJECT
              </div>
              <h3>AI Engineering Project</h3>
              <h4>AI Portfolio Assistant · Independent learning project</h4>
              <p>
                Designed and built a retrieval-augmented portfolio assistant
                using React, Python, FastAPI and Groq. Implemented document
                ingestion for JSON and multiple PDFs, text chunking,
                multilingual embeddings, FAISS vector indexing, hybrid
                retrieval, source attribution, and an interactive chat
                interface.
              </p>
              <div className="inline-tags">
                <span>Python</span>
                <span>FastAPI</span>
                <span>RAG</span>
                <span>FAISS</span>
                <span>Groq</span>
              </div>
            </div>
          </article>
        </div>
      </Page>
    );
  if (view === "ai-engineering")
    return (
      <Page
        title="AI Engineering"
        eyebrow="EXPERTISE / AI SYSTEMS"
        intro="Hands-on work building an AI assistant that can retrieve and explain information from structured and unstructured knowledge sources."
      >
        <div className="ai-project-panel">
          <div className="ai-project-heading">
            <span className="ai-project-icon">
              <i className="uil uil-brain" />
            </span>
            <div>
              <span className="experience-meta">
                PERSONAL PROJECT · 2026 — ONGOING
              </span>
              <h3>AI Portfolio Assistant</h3>
              <p>Retrieval-Augmented Generation (RAG) application</p>
            </div>
          </div>
          <div className="architecture-flow">
            <span>React UI</span>
            <i className="uil uil-arrow-right" />
            <span>FastAPI</span>
            <i className="uil uil-arrow-right" />
            <span>Hybrid Retrieval</span>
            <i className="uil uil-arrow-right" />
            <span>Groq LLM</span>
          </div>
          <p className="ai-project-description">
            The system retrieves relevant context from JSON knowledge and
            multiple PDF documents, then sends that context to an LLM to
            generate grounded answers with source references.
          </p>
          <div className="ai-stack-grid">
            {aiStack.map(([name, detail]) => (
              <div className="ai-stack-card" key={name}>
                <strong>{name}</strong>
                <small>{detail}</small>
              </div>
            ))}
          </div>
          <button
            className="workspace-primary-button"
            onClick={() =>
              onAsk(
                "Jelaskan arsitektur AI Portfolio Assistant yang dibangun Hari, termasuk alur RAG dari dokumen sampai jawaban LLM.",
              )
            }
          >
            Ask AI about this project <i className="uil uil-arrow-up-right" />
          </button>
        </div>
      </Page>
    );
  if (view === "skills")
    return (
      <Page
        title="Technical skills"
        eyebrow="EXPERTISE / TOOLKIT"
        intro="Technologies and tools used across frontend, backend, and AI engineering."
      >
        <div className="skills-modern-grid">
          {coreStack.map(([group, text]) => (
            <article className="skill-modern-card" key={group}>
              <span className="experience-meta">CORE TECHNOLOGY</span>
              <h3>{group}</h3>
              <p>{text}</p>
            </article>
          ))}
          <article className="skill-modern-card skill-modern-card--ai">
            <span className="experience-meta">HANDS-ON PROJECT</span>
            <h3>
              <i className="uil uil-brain" /> AI Engineering & RAG
            </h3>
            <p>
              Python · FastAPI · LLM · Groq API · RAG · Embeddings · Sentence
              Transformers · FAISS · Hybrid Search · PyMuPDF · Document
              Ingestion
            </p>
            <small>
              Applied in the personal AI Portfolio Assistant project.
            </small>
          </article>
        </div>
        <div className="section-action-row">
          <button
            className="workspace-primary-button"
            onClick={() =>
              onAsk(
                "Jelaskan skill AI Engineering Hari dan bagaimana skill tersebut diterapkan di project AI Portfolio Assistant.",
              )
            }
          >
            Ask about my skills <i className="uil uil-arrow-up-right" />
          </button>
        </div>
      </Page>
    );
  if (view === "projects")
    return (
      <Page
        title="Selected projects"
        eyebrow="WORK / PROJECTS"
        intro="A selection of product interfaces, engineering work, and repositories."
      >
        <Portfolio />
        <Repo />
      </Page>
    );
  if (view === "education")
    return (
      <Page
        title="Education & courses"
        eyebrow="PROFILE / LEARNING"
        intro="Formal education and selected courses listed in my CV."
      >
        <div className="education-modern-grid">
          <article className="education-card">
            <span className="experience-meta">
              2017 — 2021 · BACHELOR'S DEGREE
            </span>
            <h3>Informatics Engineering</h3>
            <p>Universitas Komputer Indonesia (UNIKOM)</p>
          </article>
          <article className="education-card">
            <span className="experience-meta">
              2014 — 2017 · VOCATIONAL HIGH SCHOOL
            </span>
            <h3>Informatics Engineering</h3>
            <p>SMK Islamiyah Ciawi</p>
          </article>
        </div>
        <div className="courses-section">
          <div className="courses-heading">
            <span className="experience-meta">CONTINUOUS LEARNING</span>
            <h3>Courses & professional development</h3>
          </div>
          <div className="courses-grid">
            {courses.map(([name, provider, year]) => (
              <article className="course-card" key={name}>
                <span className="course-icon">
                  <i className="uil uil-award" />
                </span>
                <div>
                  <h4>{name}</h4>
                  <p>{provider}</p>
                  <small>{year}</small>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Page>
    );
  if (view === "contact")
    return (
      <Page
        title="Let's connect"
        eyebrow="CONTACT / SAY HELLO"
        intro="Have a role, project, or collaboration in mind? Feel free to reach out."
      >
        <Contact />
      </Page>
    );
  return null;
}

function Page({ title, eyebrow, intro, children }) {
  return (
    <section className="portfolio-page">
      <div className="page-heading">
        <span>{eyebrow}</span>
        <h1>{title}</h1>
        <p>{intro}</p>
      </div>
      <div className="page-body">{children}</div>
    </section>
  );
}
