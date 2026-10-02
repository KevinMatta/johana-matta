"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { loadScrollTrigger, reducedMotion } from "@/lib/motion";

export default function Services() {
  useEffect(() => {
    const initGsap = async () => {
      await loadScrollTrigger();
      if (reducedMotion()) return;

      gsap
        .timeline({ scrollTrigger: { trigger: ".services", start: "top 72%" } })
        .from(".services .section-label", { opacity: 0, letterSpacing: "1em", duration: 1, ease: "power3.out" })
        .from(".services-title .line-in", { yPercent: 115, duration: 1.1, ease: "expo.out" }, "-=.75")
        .from(".services-catalog-btn",    { opacity: 0, x: 24, duration: 0.7, ease: "power3.out" }, "-=.6");

      gsap.utils.toArray<HTMLElement>(".service").forEach((el, i) => {
        gsap.timeline({ scrollTrigger: { trigger: el, start: "top 85%" }, delay: (i % 2) * 0.12 })
          .from(el.querySelector(".service-line"), { scaleX: 0, duration: 1.2, ease: "expo.inOut" })
          .from(el.querySelector(".service-num"),  { yPercent: 60, opacity: 0, duration: 0.8, ease: "power3.out" }, 0.3)
          .from(el.querySelectorAll(".service-name, .service-desc"), { y: 24, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.08 }, 0.4);
      });
    };

    initGsap();
  }, []);

  const services = [
    {
      num: "01",
      name: ["Maquillaje", "Nupcial"],
      desc: "Un día único merece un maquillaje extraordinario. Desde la prueba previa hasta el gran día, creo un look que te represente completamente y perdure toda la jornada.",
    },
    {
      num: "02",
      name: ["Eventos", "Sociales"],
      desc: "Celebra tus logros con un look que refleje la mujer extraordinaria que eres. Maquillaje de larga duración, diseñado para brillar en fotos y en persona.",
    },
    {
      num: "03",
      name: ["Servicio", "a Domicilio"],
      desc: "La experiencia de un estudio profesional en la úbicacion de tu preferencia. Llevo todo el equipo necesario para que te prepares sin estrés en el día más importante."
    },
    {
      num: "04",
      name: ["Consultoría", "de Imagen"],
      desc: "Aprende los secretos de tu propio rostro. Una sesión íntima donde descubrirás técnicas, colores y productos que potencian tu belleza natural de forma auténtica.",
    },
  ];

  return (
    <section className="services" id="services">
      <div className="services-hdr">
        <div>
          <span className="section-label" style={{ color: "#8a7145" }}>Servicios</span>
          <h2 className="services-title"><span className="line"><span className="line-in">Propuestas de Belleza</span></span></h2>
        </div>
        <a
          href="/Cat%C3%A1logo%20de%20Servicios.pdf"
          download="Catalogo-Johana-Matta.pdf"
          className="services-catalog-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Descargar catálogo completo
        </a>
      </div>
      <div className="services-grid">
        {services.map((s) => (
          <div className="service" key={s.num}>
            <span className="service-line" aria-hidden="true" />
            <div className="service-num">{s.num}</div>
            <div>
              <h3 className="service-name">
                {s.name[0]}
                <br />
                {s.name[1]}
              </h3>
              <p className="service-desc">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
