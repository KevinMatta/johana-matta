"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

function countUp(el: HTMLElement, end: number, duration: number) {
  const startTime = performance.now();
  const step = (now: number) => {
    const t = Math.min((now - startTime) / (duration * 1000), 1);
    const eased = 1 - Math.pow(1 - t, 2);
    el.textContent = Math.round(eased * end) + "+";
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export default function About() {
  const stat10Ref  = useRef<HTMLDivElement>(null);
  const stat500Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initGsap = async () => {
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      gsap
        .timeline({ scrollTrigger: { trigger: ".about", start: "top 70%" } })
        .from(".section-label",  { opacity: 0, y: 14, duration: 0.4 })
        .from(".about-headline", { opacity: 0, y: 28, duration: 0.6, ease: "power2.out" }, "-=.2")
        .from(".about-body",     { opacity: 0, y: 16, duration: 0.45, stagger: 0.08 }, "-=.3")
        .from(".about-stats",    { opacity: 0, y: 16, duration: 0.4 }, "-=.25");

      gsap.from(".about-image-el", {
        scale: 1.06,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: { trigger: ".about-image", start: "top 85%" },
      });
    };

    initGsap();

    // Counter — IntersectionObserver is more reliable than ScrollTrigger for one-shot counts
    const years  = stat10Ref.current;
    const customers = stat500Ref.current;
    if (!years || !customers) return;

    let fired = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (fired) return;
        if (entries.some((e) => e.isIntersecting)) {
          fired = true;
          countUp(years,  15,  1.2);
          countUp(customers, 800, 2.0);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    const statsEl = document.querySelector(".about-stats");
    if (statsEl) observer.observe(statsEl);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="about" id="about">
      <div className="about-text">
        <span className="section-label">La Artista</span>
        <p className="about-signature">Maquillaje signature: <em>Soft Glam</em></p>
        <h2 className="about-headline">
          Cada rostro
          <br />
          es un lienzo
          <br />
          <em>único</em>
        </h2>
        <p className="about-body">
          Con más de una década perfeccionando el arte del maquillaje, he desarrollado
          un lenguaje visual propio: preciso, sensible y profundamente humano.
          Mi trabajo nace del estudio minucioso de la luz, la textura y la individualidad
          de cada clienta.
        </p>
        <p className="about-body">
          Con una clientela que incluye novias, modelos y artistas,
          llevo mi firma a cada proyecto con discreción y excelencia absoluta.
        </p>
        <div className="about-stats">
          <div>
            <div className="stat-num" ref={stat10Ref}>0+</div>
            <div className="stat-lbl">Años de experiencia</div>
          </div>
          <div>
            <div className="stat-num" ref={stat500Ref}>0+</div>
            <div className="stat-lbl">Clientas satisfechas</div>
          </div>
        </div>
      </div>
      <div className="about-image">
        <Image
          className="about-image-el"
          src="/images/about.png"
          alt="Johana Matta trabajando"
          fill
          sizes="(max-width: 860px) 100vw, 50vw"
          style={{ objectFit: "cover", objectPosition: "center 20%" }}
        />
      </div>
    </section>
  );
}
