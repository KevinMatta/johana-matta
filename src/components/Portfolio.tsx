"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

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
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const count = images.length;

      const setWrapperHeight = () => {
        if (!wrapperRef.current || !outerRef.current) return;
        const dist = calcScrollDist(outerRef.current, count);
        wrapperRef.current.style.height = `${dist + window.innerHeight}px`;
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

        if (outerRef.current && trackRef.current && wrapperRef.current) {
          const dist = calcScrollDist(outerRef.current, count);
          if (dist > 0) {
            gsap.to(trackRef.current, {
              x: () => -calcScrollDist(outerRef.current!, count),
              ease: "none",
              scrollTrigger: {
                trigger: wrapperRef.current,
                start: "top top",
                end: () => `+=${calcScrollDist(outerRef.current!, count)}`,
                scrub: true,
                invalidateOnRefresh: true,
              },
            });
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
    <div ref={wrapperRef}>
      <section className="portfolio" id="portfolio" ref={sectionRef}>
        <div className="portfolio-hdr">
          <span className="section-label">Portafolio</span>
          <h2 className="portfolio-title">Proyectos destacados</h2>
        </div>

        <div className="carousel-outer" ref={outerRef}>
          <div className="carousel-track" ref={trackRef}>
            {images.map((src, i) => (
              <div className="pgi" key={i}>
                <Image
                  className="pgi-img"
                  src={src}
                  alt={`Trabajo de Johana Matta ${i + 1}`}
                  fill
                  sizes="(max-width:480px) 92vw, (max-width:860px) 46vw, 30vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
