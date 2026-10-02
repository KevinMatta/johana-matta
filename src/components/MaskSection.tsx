"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { loadScrollTrigger, reducedMotion } from "@/lib/motion";

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

    /* The fixed image layers only need to exist while their window is on screen */
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => (e.target as HTMLElement).classList.toggle("in-view", e.isIntersecting)),
      { rootMargin: "20% 0px" }
    );
    document.querySelectorAll(".mwin").forEach((w) => io.observe(w));

    const initGsap = async () => {
      await loadScrollTrigger();

      const mobile = window.innerWidth <= 480;
      const startOffset = mobile ? "top 90%" : "top bottom";
      const endOffset   = mobile ? "bottom 10%" : "bottom top";

      if (!reducedMotion()) {
        /* Each window "opens" from the bottom as it enters, while the image settles */
        gsap.utils.toArray<HTMLElement>(".mwin").forEach((win) => {
          gsap.timeline({ scrollTrigger: { trigger: win, start: "top 88%" } })
            .fromTo(win, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "expo.out" })
            .from(win.querySelector(".mwin-bg"), { scale: 1.18, duration: 1.8, ease: "expo.out" }, 0);
        });

        gsap.utils.toArray<HTMLElement>(".mphr").forEach((el) => {
          gsap.from(el, {
            opacity: 0, y: 40, duration: 1.1, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%" },
          });
        });
      }

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
            scrub: 0.4,
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
            scrub: 0.4,
          },
        }
      );
    };

    initGsap();

    return () => {
      window.removeEventListener("load",   clipSection);
      clearTimeout(rt);
      io.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  /* DOM order mirrors Webflow's container exactly:
     win-left → text-left → big-word → win-right → text-right (×2) */
  return (
    <section className="mask-section" id="mask-section">
      <div className="mcontainer">

        {/* ── Pair 1 left ── */}
        <div className="mwin" id="w1l"><div className="mwin-bg" /></div>
        <p className="mphr p1l">
          Cada momento merece
          <br />
          ser inolvidable
        </p>

        {/* ── ELEGANCIA ── */}
        <div className="mword" id="elegancia">ELEGANCIA</div>

        {/* ── Pair 1 right ── */}
        <div className="mwin" id="w1r"><div className="mwin-bg" /></div>
        <p className="mphr p1r">
          para brillar
          <br />
          cuanto importa
        </p>

        {/* ── Pair 2 left ── */}
        <div className="mwin" id="w2l"><div className="mwin-bg" /></div>
        <p className="mphr p2l">
          tu mejor imagen,
          <br />
          sin perder tu esencia
        </p>

        {/* ── EXCELENCIA ── */}
        <div className="mword" id="excelencia">EXCELENCIA</div>

        {/* ── Pair 2 right ── */}
        <div className="mwin" id="w2r"><div className="mwin-bg" /></div>
        <p className="mphr p2r">
          cada detalle cuenta
          <br />
          en ese gran evento
        </p>

      </div>
    </section>
  );
}
