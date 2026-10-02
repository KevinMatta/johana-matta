"use client";

import { useEffect } from "react";
import Image from "next/image";
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

    let rt: ReturnType<typeof setTimeout>;
    const onResize = () => { clearTimeout(rt); rt = setTimeout(clipSection, 150); };
    clipSection();
    window.addEventListener("load",   clipSection);
    window.addEventListener("resize", onResize);

    const initGsap = async () => {
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const mobile = window.innerWidth <= 480;
      const startOffset = mobile ? "top 90%" : "top bottom";
      const endOffset   = mobile ? "bottom 10%" : "bottom top";

      /* Parallax inside each window (replaces background-attachment:fixed,
         which forces a full repaint every scroll frame) */
      if (!mobile && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.utils.toArray<HTMLElement>(".mwin").forEach((win) => {
          gsap.fromTo(
            win.querySelector(".mwin-img"),
            { yPercent: -6 },
            {
              yPercent: 6,
              ease: "none",
              scrollTrigger: { trigger: win, start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        });
      }

      /* ELEGANCIA — sweeps right → left as you scroll */
      gsap.fromTo(
        "#elegancia",
        { x: "60vw", force3D: true },
        {
          x: "-120vw",
          ease: "none",
          scrollTrigger: {
            trigger: "#elegancia",
            start: startOffset,
            end: endOffset,
            scrub: true,
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
            scrub: true,
          },
        }
      );
    };

    initGsap();

    return () => {
      window.removeEventListener("load",   clipSection);
      clearTimeout(rt);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  /* DOM order mirrors Webflow's container exactly:
     win-left → text-left → big-word → win-right → text-right (×2) */
  return (
    <section className="mask-section" id="mask-section">
      <div className="mcontainer">

        {/* ── Pair 1 left ── */}
        <div className="mwin" id="w1l">
          <div className="mwin-img">
            <Image src="/images/portfolio-15.jpg" alt="" fill sizes="(max-width:480px) 45vw, 25vw" />
          </div>
        </div>
        <p className="mphr p1l">
          Cada momento merece
          <br />
          ser inolvidable
        </p>

        {/* ── ELEGANCIA ── */}
        <div className="mword" id="elegancia">ELEGANCIA</div>

        {/* ── Pair 1 right ── */}
        <div className="mwin" id="w1r">
          <div className="mwin-img">
            <Image src="/images/portfolio-05.jpg" alt="" fill sizes="(max-width:480px) 45vw, 25vw" />
          </div>
        </div>
        <p className="mphr p1r">
          para brillar
          <br />
          cuanto importa
        </p>

        {/* ── Pair 2 left ── */}
        <div className="mwin" id="w2l">
          <div className="mwin-img">
            <Image src="/images/portfolio-09.jpg" alt="" fill sizes="(max-width:480px) 45vw, 25vw" />
          </div>
        </div>
        <p className="mphr p2l">
          tu mejor imagen,
          <br />
          sin perder tu esencia
        </p>

        {/* ── EXCELENCIA ── */}
        <div className="mword" id="excelencia">EXCELENCIA</div>

        {/* ── Pair 2 right ── */}
        <div className="mwin" id="w2r">
          <div className="mwin-img">
            <Image src="/images/portfolio-26.JPG" alt="" fill sizes="(max-width:480px) 45vw, 25vw" />
          </div>
        </div>
        <p className="mphr p2r">
          cada detalle cuenta
          <br />
          en ese gran evento
        </p>

      </div>
    </section>
  );
}
