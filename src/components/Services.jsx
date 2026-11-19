import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const services = [
  {
    title: "UI/UX Designer",
    icon: "uil uil-web-grid",
    detailTitle: "UI Designer",
    details: [
      "I develop the user interface.",
      "i create ui design.",
      "I create ux element interactions.",
    ],
  },
  {
    title: "Frontend Developer",
    icon: "uil uil-arrow",
    detailTitle: "Frontend Developer",
    details: [
      "I develop the user interface.",
      "Convert Figma to code HTML,CSS & JAVASCRIPT.",
      "Convert to react js.",
      "Web page development.",
      "Rest API.",
      "Collaboration with GIT.",
    ],
  },
  {
    title: "Branding Designer",
    icon: "uil uil-pen",
    detailTitle: "Branding Designer",
    details: ["I position your company brand."],
  },
];

export default function Services() {
  const [active, setActive] = useState(null);
  const closeRef = useRef(null);
  const lastTrigger = useRef(null);
  const close = () => setActive(null);

  useEffect(() => {
    if (active === null) return;
    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") close();
      if (event.key === "Tab") {
        const modal = document.querySelector(".services-dialog");
        const focusable = [
          ...(modal?.querySelectorAll(
            'button, a[href], [tabindex]:not([tabindex="-1"])',
          ) || []),
        ];
        if (!focusable.length) return;
        const first = focusable[0],
          last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = priorOverflow;
      window.removeEventListener("keydown", onKeyDown);
      lastTrigger.current?.focus();
    };
  }, [active]);

  return (
    <section className="services section" id="services">
      <h2 className="section__title">Services</h2>
      <span className="section__subtitle">What i offer</span>
      <div className="services__container container grid">
        {services.map((service, index) => (
          <article className="services__content" key={service.title}>
            <div>
              <i
                className={`${service.icon} services__icon`}
                aria-hidden="true"
              />
              <h3 className="services__title">
                {service.title.split(" ").map((part, i) => (
                  <React.Fragment key={i}>
                    {i ? <br /> : null}
                    {part}
                  </React.Fragment>
                ))}
              </h3>
            </div>
            <button
              type="button"
              className="button button--flex button--small button--link services__button"
              onClick={(event) => {
                lastTrigger.current = event.currentTarget;
                setActive(index);
              }}
            >
              View More{" "}
              <i
                className="uil uil-arrow-right button__icon"
                aria-hidden="true"
              />
            </button>
          </article>
        ))}
      </div>
      {active !== null &&
        createPortal(
          <div
            className="services-overlay"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) close();
            }}
          >
            <div
              className="services-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="service-dialog-title"
              key={active}
            >
              <button
                ref={closeRef}
                className="services-dialog__close"
                type="button"
                onClick={close}
                aria-label="Close service details"
              >
                <i className="uil uil-times" aria-hidden="true" />
              </button>
              <span className="services-dialog__eyebrow">Service details</span>
              <h3 id="service-dialog-title">{services[active].detailTitle}</h3>
              <ul className="services-dialog__list">
                {services[active].details.map((detail) => (
                  <li key={detail}>
                    <i className="uil uil-check-circle" aria-hidden="true" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
