import React, { useEffect, useState } from "react";
import { RepoSlides } from "./RepoSlides.jsx";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(
    () => localStorage.getItem("selected-theme") !== "light",
  );
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    document.body.classList.toggle("dark-theme", dark);
    localStorage.setItem("selected-theme", dark ? "dark" : "light");
  }, [dark]);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY >= 80);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  const toggleTheme = () => setDark((old) => !old);
  const goTo = (event, id) => {
    event.preventDefault();
    setMenuOpen(false);
    const target = document.getElementById(id);
    if (!target) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    target.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
    history.replaceState(null, "", `#${id}`);
  };
  useEffect(() => {
    const sections = [...document.querySelectorAll("main section[id]")];
    const onScroll = () => {
      const y = window.scrollY;
      let id = "home";
      for (const el of sections) {
        if (y >= el.offsetTop - 100 && y <= el.offsetTop + el.offsetHeight)
          id = el.id;
      }
      document
        .querySelectorAll('.nav__link[href^="#"]')
        .forEach((a) =>
          a.classList.toggle(
            "active-link",
            a.getAttribute("href") === "#" + id,
          ),
        );
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? "scroll-header" : ""}`} id="header">
      <nav className="nav container">
        <a href="#home" className="nav__logo" onClick={(e) => goTo(e, "home")}>
          Hari
        </a>
        <div
          className={`nav__menu ${menuOpen ? "show-menu" : ""}`}
          id="nav-menu"
        >
          <ul className="nav__list grid">
            <li className="nav__item">
              <a
                href="#home"
                className="nav__link active-link"
                onClick={(e) => goTo(e, "home")}
              >
                <i className="uil uil-estate nav__icon"></i>Home
              </a>
            </li>
            <li className="nav__item">
              <a
                href="#about"
                className="nav__link"
                onClick={(e) => goTo(e, "about")}
              >
                <i className="uil uil-user nav__icon"></i>About
              </a>
            </li>
            <li className="nav__item">
              <a
                href="#skills"
                className="nav__link"
                onClick={(e) => goTo(e, "skills")}
              >
                <i className="uil uil-user nav__icon"></i>Skills
              </a>
            </li>
            <li className="nav__item">
              <a
                href="#services"
                className="nav__link"
                onClick={(e) => goTo(e, "services")}
              >
                <i className="uil uil-briefcase-alt nav__icon"></i>Services
              </a>
            </li>
            <li className="nav__item">
              <a
                href="#portfolio"
                className="nav__link"
                onClick={(e) => goTo(e, "portfolio")}
              >
                <i className="uil uil-scenery nav__icon"></i>Portfolio
              </a>
            </li>
            <li className="nav__item">
              <a
                href="#contact"
                className="nav__link"
                onClick={(e) => goTo(e, "contact")}
              >
                <i className="uil uil-message nav__icon"></i>Contact me
              </a>
            </li>
          </ul>
          <button
            type="button"
            className="uil uil-times nav__close"
            id="nav-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Tutup menu"
          ></button>
        </div>
        <div className="nav__btns">
          <button
            type="button"
            className={`uil change-theme ${dark ? "uil-sun" : "uil-moon"}`}
            id="theme-button"
            onClick={toggleTheme}
            aria-label={dark ? "Aktifkan tema terang" : "Aktifkan tema gelap"}
            title={dark ? "Light mode" : "Dark mode"}
          ></button>
          <button
            type="button"
            className="nav__toggle"
            id="nav-toggle"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-label="Buka menu navigasi"
          >
            <i className="uil uil-apps"></i>
          </button>
        </div>
      </nav>
    </header>
  );
}
