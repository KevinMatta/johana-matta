"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { loadScrollTrigger, reducedMotion } from "@/lib/motion";
import { dbg } from "@/lib/debug";

export default function Hero() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initGsap = async () => {
      await loadScrollTrigger();
      if (reducedMotion()) return;

      // Entrance: photo settles, name rises out of a mask line by line
      gsap.timeline({ delay: 0.05 })
        .from(".hero-img",       { scale: 1.22, duration: 2.4, ease: "expo.out" })
        .from(".nav",            { yPercent: -100, opacity: 0, duration: 0.9, ease: "power3.out" }, 0.3)
        .from(".eyebrow",        { opacity: 0, letterSpacing: "1.1em", duration: 1.2, ease: "power3.out" }, 0.35)
        .from(".hero-name .line-in", { yPercent: 115, rotate: 3, duration: 1.2, ease: "expo.out", stagger: 0.12 }, 0.45)
        .from(".hero-tagline",   { opacity: 0, y: 14, duration: 0.8 }, 0.95)
        .from(".hero-scroll-wrap", { opacity: 0, duration: 0.8 }, 1.2);

      if (dbg("noparallax")) return;

      // Scroll: photo drifts down, text lifts away
      gsap.to(wrapperRef.current, {
        yPercent: 18,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero-content", {
        y: -90,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "70% top", scrub: true },
      });
    };

    initGsap();
  }, []);

  return (
    <section className="hero" id="home">
      <div className="hero-img-wrapper" ref={wrapperRef}>
        <Image
          className="hero-img"
          src="/images/hero.jpg"
          alt="Johana Matta"
          fill
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center 22%" }}
          priority
        />
      </div>
      <div className="hero-overlay" />
      <div className="hero-content">
        <span className="eyebrow">Makeup Artistry</span>
        <h1 className="hero-name">
          <span className="line"><span className="line-in"><em>Johana</em></span></span>
          <span className="line"><span className="line-in">Matta</span></span>
        </h1>
        <p className="hero-tagline">El arte de revelar tu mejor versión</p>
      </div>
      <div className="hero-scroll-wrap" aria-hidden="true">
        <p className="hero-scroll">Scroll</p>
        <span className="hero-scroll-line" />
      </div>
    </section>
  );
}
