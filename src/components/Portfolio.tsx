"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { loadScrollTrigger, reducedMotion, scrollDriven } from "@/lib/motion";

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

const GAP = 4;

function calcScrollDist(outerEl: HTMLDivElement, count: number) {
  const vw = outerEl.clientWidth;
  const perPage = vw < 480 ? 1 : vw < 860 ? 2 : 3;
  const itemW = (vw - (perPage - 1) * GAP) / perPage;
  return Math.max(0, count * itemW + (count - 1) * GAP - vw);
}

export default function Portfolio() {
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const sectionRef  = useRef<HTMLElement>(null);
  const outerRef    = useRef<HTMLDivElement>(null);
  const trackRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: gsap.Context;

    const init = async () => {
      const ScrollTrigger = await loadScrollTrigger();
      const still = reducedMotion();

      const count = images.length;
      const css = scrollDriven();

      const setWrapperHeight = () => {
        if (!wrapperRef.current || !outerRef.current || !trackRef.current) return;
        const outer = outerRef.current;
        const dist = calcScrollDist(outer, count);
        wrapperRef.current.style.height = `${dist + window.innerHeight}px`;
        if (!css || dist <= 0) return;

        // CSS scroll timeline: track travel distance + the slice of the
        // timeline during which each card is on screen (for its inner drift)
        trackRef.current.style.setProperty("--pf-dist", `${dist}px`);
        const vw = outer.clientWidth;
        const cards = Array.from(trackRef.current.children) as HTMLElement[];
        cards.forEach((card) => {
          const left = card.offsetLeft;
          const from = ((left - vw) / dist) * 100;
          const to = ((left + card.offsetWidth) / dist) * 100;
          card.querySelector<HTMLElement>(".pgi-inner")?.style.setProperty(
            "animation-range", `contain ${from.toFixed(2)}% contain ${to.toFixed(2)}%`
          );
        });
      };

      setWrapperHeight();
      ScrollTrigger.addEventListener("refresh", setWrapperHeight);

      ctx = gsap.context(() => {
        gsap.from(".portfolio-hdr", {
          opacity: 0, y: 22, duration: 0.5, ease: "power2.out",
          scrollTrigger: { trigger: wrapperRef.current, start: "top 78%" },
        });
        gsap.from(".carousel-outer", {
          opacity: 0, y: 20, duration: 0.5, ease: "power2.out",
          scrollTrigger: { trigger: wrapperRef.current, start: "top 78%" },
          delay: 0.1,
        });

        gsap.from(".pgi", {
          yPercent: 14, opacity: 0, duration: 1.1, ease: "power3.out", stagger: 0.09,
          scrollTrigger: { trigger: wrapperRef.current, start: "top 70%" },
        });

        if (css && wrapperRef.current && outerRef.current) {
          // Movement is pure CSS (see .pf-wrap); JS only updates the counter
          const counter = sectionRef.current?.querySelector<HTMLElement>(".pf-current");
          let shown = 1;
          ScrollTrigger.create({
            trigger: wrapperRef.current,
            start: "top top",
            end: () => `+=${calcScrollDist(outerRef.current!, count)}`,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const n = Math.min(count, 1 + Math.round(self.progress * (count - 1)));
              if (counter && n !== shown) { shown = n; counter.textContent = String(n).padStart(2, "0"); }
            },
          });
        } else if (outerRef.current && trackRef.current && wrapperRef.current) {
          const setBar = gsap.quickSetter(".pf-progress-bar", "scaleX");
          const counter = sectionRef.current?.querySelector<HTMLElement>(".pf-current");
          let shown = 1;

          const dist = calcScrollDist(outerRef.current, count);
          if (dist > 0) {
            const scroller = gsap.to(trackRef.current, {
              x: () => -calcScrollDist(outerRef.current!, count),
              ease: "none",
              scrollTrigger: {
                trigger: wrapperRef.current,
                start: "top top",
                end: () => `+=${calcScrollDist(outerRef.current!, count)}`,
                scrub: 0.5,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                  setBar(self.progress);
                  const n = Math.min(count, 1 + Math.round(self.progress * (count - 1)));
                  if (counter && n !== shown) { shown = n; counter.textContent = String(n).padStart(2, "0"); }
                },
              },
            });

            if (!still) {
              /* Each photo drifts inside its frame while the track moves */
              gsap.utils.toArray<HTMLElement>(".pgi").forEach((card) => {
                gsap.fromTo(
                  card.querySelector(".pgi-inner"),
                  { xPercent: -8 },
                  {
                    xPercent: 8,
                    ease: "none",
                    scrollTrigger: {
                      trigger: card,
                      containerAnimation: scroller,
                      start: "left right",
                      end: "right left",
                      scrub: true,
                    },
                  }
                );
              });
            }
          }
        }
      }, sectionRef);

      return () => ScrollTrigger.removeEventListener("refresh", setWrapperHeight);
    };

    const timer = setTimeout(() => { init(); }, 100);

    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <div className="pf-wrap" ref={wrapperRef}>
      <section className="portfolio" id="portfolio" ref={sectionRef}>
        <div className="portfolio-hdr">
          <span className="section-label">Portafolio</span>
          <h2 className="portfolio-title">Proyectos destacados</h2>
        </div>

        <div className="carousel-outer" ref={outerRef}>
          <div className="carousel-track" ref={trackRef}>
            {images.map((src, i) => (
              <div className="pgi" key={i}>
                <div className="pgi-inner">
                <Image
                  className="pgi-img"
                  src={src}
                  alt={`Trabajo de Johana Matta ${i + 1}`}
                  fill
                  sizes="(max-width:480px) 92vw, (max-width:860px) 46vw, 30vw"
                  style={{ objectFit: "cover" }}
                />
                </div>
                <span className="pgi-num">{String(i + 1).padStart(2, "0")}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pf-meta" aria-hidden="true">
          <span className="pf-count"><span className="pf-current">01</span> / {String(images.length).padStart(2, "0")}</span>
          <span className="pf-progress"><span className="pf-progress-bar" /></span>
          <span className="pf-hint">Sigue bajando</span>
        </div>
      </section>
    </div>
  );
}
