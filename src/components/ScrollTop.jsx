import React, { useEffect, useState } from "react";
import { RepoSlides } from "./RepoSlides.jsx";

export default function ScrollTop() {
  const [scrollUp, setScrollUp] = useState(false);
  useEffect(() => {
    const fn = () => setScrollUp(window.scrollY >= 560);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <a
      href="#"
      className={`scrollup ${scrollUp ? "show-scroll" : ""}`}
      id="scroll-up"
    >
      <i className="uil uil-arrow-up scrollup__icon"></i>
    </a>
  );
}
