"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { loadScrollTrigger, reducedMotion } from "@/lib/motion";

export default function Footer() {
  useEffect(() => {
    const initGsap = async () => {
      await loadScrollTrigger();
      if (reducedMotion()) return;

      gsap.timeline({ scrollTrigger: { trigger: "footer", start: "top 84%" } })
        .from(".footer-logo .ch", { yPercent: 110, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.035 })
        .from(".footer-tagline",  { opacity: 0, letterSpacing: "1em", duration: 1, ease: "power3.out" }, "-=.6");

      gsap.from(".contact-item", {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".footer-contacts", start: "top 88%" },
      });
    };

    initGsap();
  }, []);

  return (
    <footer id="contact">
      <div className="footer-inner">

        <div className="footer-brand">
          <div className="footer-logo" aria-label="Johana Matta">
            {/* letters grouped per word so a line can only break between words */}
            {["JOHANA", "MATTA"].map((word, w) => (
              <span className="word" aria-hidden="true" key={word}>
                {w > 0 && " "}
                {word.split("").map((c, i) => <span className="ch" key={i}>{c}</span>)}
              </span>
            ))}
          </div>
          <div className="footer-tagline">Makeup Artistry</div>
        </div>

        <div className="footer-contacts">

          <a
            href="mailto:johanamatta.mkt@gmail.com"
            className="contact-item"
          >
            <svg className="contact-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span className="contact-label">Correo</span>
            <span className="contact-value">johanamatta.mkt@gmail.com</span>
          </a>

          <a
            href="https://instagram.com/johanamattamakeup"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-item"
          >
            <svg className="contact-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeLinecap="round" strokeWidth="2" />
            </svg>
            <span className="contact-label">Instagram</span>
            <span className="contact-value">@johanamattamakeup</span>
          </a>

          <a
            href="https://wa.me/50431705489"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-item"
          >
            <svg className="contact-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span className="contact-label">WhatsApp</span>
            <span className="contact-value">+504 31705489</span>
          </a>

        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Johana Matta. Todos los derechos reservados.</span>
        <span>Makeup Artistry</span>
      </div>
    </footer>
  );
}
