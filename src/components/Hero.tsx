"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

export default function Hero() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initGsap = async () => {
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      // Entrance animations
      const tl = gsap.timeline({ delay: 0.1 });
      tl.from(".eyebrow",      { opacity: 0, y: 14, duration: 0.45 })
        .from(".hero-name",    { opacity: 0, y: 36, duration: 0.65, ease: "power2.out" }, "-=.25")
        .from(".hero-tagline", { opacity: 0, y: 14, duration: 0.45 }, "-=.3")
        .from(".hero-scroll",  { opacity: 0, duration: 0.4 }, "-=.2");

      // Hero parallax — animate wrapper so next/image span inside moves
      gsap.to(wrapperRef.current, {
        yPercent: 18,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
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
          <em>Johana</em>
          <br />
          Matta
        </h1>
        <p className="hero-tagline">El arte de revelar tu mejor versión</p>
      </div>
      <p className="hero-scroll">Scroll</p>
    </section>
  );
}
