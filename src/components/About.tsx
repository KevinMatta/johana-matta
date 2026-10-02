"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { loadScrollTrigger, reducedMotion } from "@/lib/motion";
import { dbg } from "@/lib/debug";

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
      await loadScrollTrigger();
      if (reducedMotion()) return;

      gsap
        .timeline({ scrollTrigger: { trigger: ".about", start: "top 70%" } })
        .from(".about .section-label", { opacity: 0, letterSpacing: "1em", duration: 1, ease: "power3.out" })
        .from(".about-signature",       { opacity: 0, y: 12, duration: 0.6 }, "-=.7")
        .from(".about-headline .line-in", { yPercent: 115, duration: 1.1, ease: "expo.out", stagger: 0.1 }, "-=.6")
        .from(".about-body",            { opacity: 0, y: 20, duration: 0.7, stagger: 0.1 }, "-=.7")
        .from(".about-stats > div",     { opacity: 0, y: 20, duration: 0.6, stagger: 0.1 }, "-=.4");

      // Photo is unveiled like a curtain, then drifts with the scroll
      gsap.timeline({ scrollTrigger: { trigger: ".about-image", start: "top 80%" } })
        .fromTo(".about-image", { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut" })
        .fromTo(".about-image-el", { scale: 1.4 }, { scale: 1.12, duration: 2, ease: "expo.out" }, 0.2);

      if (dbg("noparallax")) return;

      gsap.fromTo(".about-image-el", { yPercent: -5 }, {
        yPercent: 5,
        ease: "none",
        scrollTrigger: { trigger: ".about-image", start: "top bottom", end: "bottom top", scrub: true },
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
          <span className="line"><span className="line-in">Cada rostro</span></span>
          <span className="line"><span className="line-in">es un lienzo</span></span>
          <span className="line"><span className="line-in"><em>único</em></span></span>
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
