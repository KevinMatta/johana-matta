"use client";

import { useEffect } from "react";
import gsap from "gsap";

export default function Services() {
  useEffect(() => {
    const initGsap = async () => {
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      gsap
        .timeline({ scrollTrigger: { trigger: ".services", start: "top 76%" } })
        .from(".services-title", { opacity: 0, y: 24, duration: 0.55, ease: "power2.out" })
        .from(".service",        { opacity: 0, y: 24, duration: 0.45, stagger: 0.07 }, "-=.3");
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
          <h2 className="services-title">Propuestas de Belleza</h2>
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
