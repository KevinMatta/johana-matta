"use client";

import { useEffect } from "react";
import gsap from "gsap";

export default function MaskSection() {
  useEffect(() => {
    const clipSection = () => {
      const section = document.querySelector(".mask-section") as HTMLElement | null;
      const last    = document.getElementById("w2r");
      if (!section || !last) return;
      if (window.innerWidth <= 480) {
        section.style.height = "auto";
        return;
      }
      const sTop = section.getBoundingClientRect().top + window.scrollY;
      const lBot = last.getBoundingClientRect().bottom + window.scrollY;
      section.style.height = lBot - sTop + 60 + "px";
    };

    clipSection();
    window.addEventListener("load",   clipSection);
    window.addEventListener("resize", clipSection);

    const initGsap = async () => {
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const mobile = window.innerWidth <= 480;
      const startOffset = mobile ? "top 90%" : "top bottom";
      const endOffset   = mobile ? "bottom 10%" : "bottom top";

      /* ELEGANCIA — sweeps right → left as you scroll */
      gsap.fromTo(
        "#elegancia",
        { x: "60vw" },
        {
          x: "-120vw",
          ease: "none",
          scrollTrigger: {
            trigger: "#elegancia",
            start: startOffset,
            end: endOffset,
            scrub: 0.6,
          },
        }
      );

      /* EXCELENCIA — sweeps left → right (opposite direction) */
      gsap.fromTo(
        "#excelencia",
        { x: "-120vw" },
        {
          x: "60vw",
          ease: "none",
          scrollTrigger: {
            trigger: "#excelencia",
            start: startOffset,
            end: endOffset,
            scrub: 0.6,
          },
        }
      );
    };

    initGsap();

    return () => {
      window.removeEventListener("load",   clipSection);
      window.removeEventListener("resize", clipSection);
    };
  }, []);

  /* DOM order mirrors Webflow's container exactly:
     win-left → text-left → big-word → win-right → text-right (×2) */
  return (
    <section className="mask-section" id="mask-section">
      <div className="mcontainer">

        {/* ── Pair 1 left ── */}
        <div className="mwin" id="w1l" />
        <p className="mphr p1l">
          Cada momento merece
          <br />
          ser inolvidable
        </p>

        {/* ── ELEGANCIA ── */}
        <div className="mword" id="elegancia">ELEGANCIA</div>

        {/* ── Pair 1 right ── */}
        <div className="mwin" id="w1r" />
        <p className="mphr p1r">
          para brillar
          <br />
          cuanto importa
        </p>

        {/* ── Pair 2 left ── */}
        <div className="mwin" id="w2l" />
        <p className="mphr p2l">
          tu mejor imagen,
          <br />
          sin perder tu esencia
        </p>

        {/* ── EXCELENCIA ── */}
        <div className="mword" id="excelencia">EXCELENCIA</div>

        {/* ── Pair 2 right ── */}
        <div className="mwin" id="w2r" />
        <p className="mphr p2r">
          cada detalle cuenta
          <br />
          en ese gran evento
        </p>

      </div>
    </section>
  );
}
