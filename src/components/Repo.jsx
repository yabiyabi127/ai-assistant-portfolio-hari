import React, { useCallback, useEffect, useRef, useState } from "react";
import { RepoSlides } from "./RepoSlides.jsx";

export default function Repo() {
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const refresh = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 3);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 3);
  }, []);
  const move = (direction) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector(".repo-slide");
    if (!card) return;
    const styles = window.getComputedStyle(el);
    const gap = parseFloat(styles.columnGap || styles.gap) || 0;
    const distance = card.getBoundingClientRect().width + gap;
    el.scrollBy({
      left: direction * distance,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const observer = new ResizeObserver(refresh);
    observer.observe(el);
    const mutation = new MutationObserver(refresh);
    mutation.observe(el, { childList: true });
    el.addEventListener("scroll", refresh, { passive: true });
    const id = requestAnimationFrame(refresh);
    return () => {
      observer.disconnect();
      mutation.disconnect();
      el.removeEventListener("scroll", refresh);
      cancelAnimationFrame(id);
    };
  }, [refresh]);
  return (
    <section className="myrepo" id="repo">
      <h2>My Repository GitHub</h2>
      <div className="repo-carousel" aria-label="GitHub repositories">
        <div
          className="repo-track"
          ref={trackRef}
          tabIndex={0}
          aria-label="Scroll through repositories"
        >
          <RepoSlides />
        </div>
        <div className="repo-controls">
          <button
            type="button"
            className="repo-control carousel-arrow-control"
            aria-label="Previous repositories"
            disabled={!canPrev}
            onClick={() => move(-1)}
          >
            <i className="uil uil-angle-left" aria-hidden="true" />
          </button>
          <span className="repo-controls__hint">Swipe or use arrows</span>
          <button
            type="button"
            className="repo-control carousel-arrow-control"
            aria-label="Next repositories"
            disabled={!canNext}
            onClick={() => move(1)}
          >
            <i className="uil uil-angle-right" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
