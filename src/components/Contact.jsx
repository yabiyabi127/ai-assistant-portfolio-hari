import React from "react";

const contacts = [
  {
    icon: "uil uil-phone",
    title: "Call Me",
    value: "082118301993",
    note: "For a quick conversation",
    href: "tel:082118301993",
  },
  {
    icon: "uil uil-envelope",
    title: "Email",
    value: "hariniawadev@gmail.com",
    note: "For roles, projects, and collaboration",
    href: "mailto:hariniawadev@gmail.com",
  },
  {
    icon: "uil uil-map-marker",
    title: "Location",
    value: "Jakarta, Indonesia",
    note: "Open to discussing suitable work arrangements",
    href: null,
  },
];

// Menampilkan informasi kontak dan tautan profesional.
export default function Contact() {
  return (
    <section className="contact section" id="contact">
      <div className="contact-redesign">
        <div className="contact-hero-card contact-spotlight">
          <div
            className="contact-hero-orbit contact-hero-orbit-a"
            aria-hidden="true"
          />
          <div
            className="contact-hero-orbit contact-hero-orbit-b"
            aria-hidden="true"
          />
          <span className="experience-meta">
            <i className="uil uil-circle" /> OPEN TO OPPORTUNITIES
          </span>
          <h3>Good work starts with a good conversation.</h3>
          <p>
            I’m always open to discussing frontend engineering, full-stack
            development, product work, and opportunities to grow in AI
            engineering. Tell me what you’re building and let’s explore how I
            can contribute.
          </p>
          <div className="contact-pill-row">
            <span>Frontend Engineering</span>
            <span>Full-Stack Development</span>
            <span>AI Engineering</span>
          </div>
          <div className="contact-cta-row">
            <a
              className="workspace-primary-button"
              href="mailto:hariniawadev@gmail.com?subject=Let's%20connect"
            >
              Let’s talk <i className="uil uil-arrow-up-right" />
            </a>
            <a
              className="contact-ghost-button"
              href="https://wa.me/6282118301993"
              target="_blank"
              rel="noreferrer"
            >
              <i className="uil uil-whatsapp" /> WhatsApp
            </a>
          </div>
          <div className="contact-hero-foot">
            <span>
              <i className="uil uil-shield-check" /> Usually happy to hear about
              thoughtful opportunities
            </span>
            <span>HARI KURNIAWAN · SOFTWARE ENGINEER</span>
          </div>
        </div>
        <div className="contact-card-grid">
          {contacts.map((item, index) => {
            const content = (
              <>
                <span className="contact-info-icon">
                  <i className={item.icon} />
                </span>
                <div>
                  <small className="contact-card-index">
                    0{index + 1} / CONTACT
                  </small>
                  <strong>{item.title}</strong>
                  <p>{item.value}</p>
                  <small className="contact-card-note">{item.note}</small>
                </div>
                {item.href && (
                  <i className="uil uil-arrow-up-right contact-info-arrow" />
                )}
              </>
            );
            return item.href ? (
              <a
                key={item.title}
                className="contact-info-card"
                href={item.href}
              >
                {content}
              </a>
            ) : (
              <div key={item.title} className="contact-info-card is-static">
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
