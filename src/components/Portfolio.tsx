"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

const images = [
  "/images/portfolio-03.jpg",
  "/images/portfolio-05.jpg",
  "/images/portfolio-08.jpg",
  "/images/portfolio-17.jpg",
  "/images/portfolio-14.jpg",
  "/images/portfolio-10.jpg",
  "/images/portfolio-20.JPG",
  "/images/portfolio-26.JPG",
  "/images/portfolio-24.JPG",
  "/images/portfolio-28.jpeg",
  "/images/portfolio-29.jpeg",
];

const pad = (n: number) => String(n).padStart(2, "0");

export default function Portfolio() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const lockUntil = useRef(0);
  const targetRef = useRef(0); // latest requested slide, so fast clicks keep stacking
  const count = images.length;

  const slides = () =>
    Array.from(trackRef.current?.children ?? []) as HTMLElement[];

  const goTo = useCallback((i: number) => {
    const track = trackRef.current;
    const el = track && (Array.from(track.children)[i] as HTMLElement | undefined);
    if (!track || !el) return;
    targetRef.current = i;
    lockUntil.current = performance.now() + 700; // ignore scroll sync mid-animation
    track.scrollTo({
      left: el.offsetLeft - (track.clientWidth - el.clientWidth) / 2,
      behavior: "smooth",
    });
  }, []);

  // Track which slide is centred (native scroll + rAF throttle, no scroll-jacking)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = track.scrollLeft + track.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      slides().forEach((el, i) => {
        const d = Math.abs(el.offsetLeft + el.clientWidth / 2 - mid);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      if (performance.now() > lockUntil.current) targetRef.current = best;
      setActive(best);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    track.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Drag-to-scroll for mouse (touch already scrolls natively)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let startX = 0, startLeft = 0, dragging = false, moved = false;

    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      dragging = true; moved = false;
      startX = e.clientX; startLeft = track.scrollLeft;
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 4) {
        moved = true;
        track.classList.add("dragging");
        track.setPointerCapture(e.pointerId);
      }
      if (moved) track.scrollLeft = startLeft - dx;
    };
    const up = () => {
      if (!dragging) return;
      dragging = false;
      if (moved) {
        track.classList.remove("dragging");
        // re-enable snap and settle on the nearest slide
        const mid = track.scrollLeft + track.clientWidth / 2;
        let best = 0, bestDist = Infinity;
        slides().forEach((el, i) => {
          const d = Math.abs(el.offsetLeft + el.clientWidth / 2 - mid);
          if (d < bestDist) { bestDist = d; best = i; }
        });
        goTo(best);
      }
    };
    track.addEventListener("pointerdown", down);
    track.addEventListener("pointermove", move);
    track.addEventListener("pointerup", up);
    track.addEventListener("pointercancel", up);
    return () => {
      track.removeEventListener("pointerdown", down);
      track.removeEventListener("pointermove", move);
      track.removeEventListener("pointerup", up);
      track.removeEventListener("pointercancel", up);
    };
  }, [goTo]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); goTo(Math.min(count - 1, targetRef.current + 1)); }
    if (e.key === "ArrowLeft")  { e.preventDefault(); goTo(Math.max(0, targetRef.current - 1)); }
  };

  return (
    <section className="portfolio" id="portfolio" aria-roledescription="carrusel" aria-label="Portafolio">
      <div className="portfolio-hdr">
        <span className="section-label">Portafolio</span>
        <h2 className="portfolio-title">Proyectos destacados</h2>
      </div>

      <div
        className="carousel-track"
        ref={trackRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {images.map((src, i) => (
          <figure
            className={`pgi${i === active ? " is-active" : ""}`}
            key={src}
            aria-roledescription="diapositiva"
            aria-label={`${i + 1} de ${count}`}
            onClick={() => i !== active && goTo(i)}
          >
            <Image
              className="pgi-img"
              src={src}
              alt={`Trabajo de Johana Matta ${i + 1}`}
              fill
              sizes="(max-width:600px) 78vw, (max-width:1100px) 44vw, 30vw"
              draggable={false}
              priority={i < 2}
            />
            <figcaption className="pgi-num">{pad(i + 1)}</figcaption>
          </figure>
        ))}
      </div>

      <div className="carousel-controls">
        <button
          className="carousel-btn"
          onClick={() => goTo(Math.max(0, targetRef.current - 1))}
          disabled={active === 0}
          aria-label="Anterior"
        >
          ←
        </button>
        <div className="carousel-status" aria-live="polite">
          <span className="carousel-count">
            <b>{pad(active + 1)}</b> / {pad(count)}
          </span>
          <span className="carousel-progress" aria-hidden="true">
            <span style={{ transform: `scaleX(${(active + 1) / count})` }} />
          </span>
        </div>
        <button
          className="carousel-btn"
          onClick={() => goTo(Math.min(count - 1, targetRef.current + 1))}
          disabled={active === count - 1}
          aria-label="Siguiente"
        >
          →
        </button>
      </div>
    </section>
  );
}
