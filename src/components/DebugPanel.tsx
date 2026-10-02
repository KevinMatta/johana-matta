"use client";

import { useEffect, useRef, useState } from "react";
import { DEBUG_FLAGS, debugFlags } from "@/lib/debug";

/* Only rendered with ?debug in the URL. Measures real frame times on the
   device while scrolling, per section, and lets us switch features off. */

const SECTIONS: [string, string][] = [
  ["home", "Inicio"],
  ["about", "La Artista"],
  ["mask-section", "Máscara"],
  ["services", "Servicios"],
  ["portfolio", "Portafolio"],
  ["contact", "Footer"],
];

type Stat = { frames: number; slow: number; time: number; worst: number };

export default function DebugPanel() {
  const [flags, setFlags] = useState<Set<string> | null>(null);
  const [rows, setRows] = useState<[string, Stat][]>([]);
  const [open, setOpen] = useState(true);
  const [live, setLive] = useState<number | null>(null);
  const stats = useRef<Record<string, Stat>>({});

  useEffect(() => {
    const f = debugFlags();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- URL is only readable on the client
    setFlags(f);
    if (!f) return;
    f.forEach((k) => document.documentElement.classList.add(`dbg-${k}`));

    let tops: [string, number][] = [];
    const measure = () => {
      tops = SECTIONS.map(([id]) => {
        const el = document.getElementById(id);
        return [id, el ? el.getBoundingClientRect().top + window.scrollY : Infinity] as [string, number];
      });
    };
    measure();
    const mt = setInterval(measure, 1000);

    let raf = 0;
    let prev = performance.now();
    let lastY = window.scrollY;
    let lastMove = 0;
    const live: number[] = [];
    const loop = (t: number) => {
      const dt = t - prev;
      prev = t;
      // Scrolling = scroll position changed since the previous frame
      // (does not depend on scroll events, which some phones throttle)
      const y = window.scrollY;
      if (y !== lastY) { lastMove = t; lastY = y; }
      const scrolling = t - lastMove < 150;
      if (scrolling && dt < 1000) {
        live.push(dt);
        if (live.length > 30) live.shift();
        const mid = window.scrollY + window.innerHeight / 2;
        let cur = tops[0]?.[0];
        for (const [id, top] of tops) if (top <= mid) cur = id;
        if (cur) {
          const s = (stats.current[cur] ??= { frames: 0, slow: 0, time: 0, worst: 0 });
          s.frames++;
          s.time += dt;
          if (dt > 25) s.slow++;
          s.worst = Math.max(s.worst, dt);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const ui = setInterval(() => {
      setRows(Object.entries(stats.current));
      setLive(live.length ? Math.round(1000 / (live.reduce((a, b) => a + b, 0) / live.length)) : null);
    }, 400);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(mt);
      clearInterval(ui);
    };
  }, []);

  if (!flags) return null;

  const toggle = (k: string) => {
    const next = new Set(flags);
    if (next.has(k)) next.delete(k); else next.add(k);
    const url = new URL(window.location.href);
    url.searchParams.set("debug", [...next].join(","));
    window.location.assign(url.toString());
  };

  const label = (id: string) => SECTIONS.find(([s]) => s === id)?.[1] ?? id;
  const report = () =>
    [
      `debug=${[...flags].join(",") || "(nada)"}`,
      `${navigator.userAgent}`,
      `dpr=${window.devicePixelRatio} vp=${window.innerWidth}x${window.innerHeight} cssScrollTimeline=${CSS.supports("animation-timeline: view()")}`,
      ...rows.map(([id, s]) =>
        `${label(id)}: ${Math.round((1000 * s.frames) / s.time)}fps, lentos ${Math.round((100 * s.slow) / s.frames)}%, peor ${Math.round(s.worst)}ms`
      ),
    ].join("\n");

  return (
    <div className="dbg-panel">
      <button className="dbg-head" onClick={() => setOpen(!open)}>
        Diagnóstico {open ? "▾" : "▸"}
      </button>
      <div className={`dbg-live${live !== null && live < 45 ? " bad" : ""}`}>
        FPS ahora: {live ?? "— (haz scroll)"}
      </div>
      {open && (
        <>
          <table>
            <thead>
              <tr><th>Sección</th><th>FPS</th><th>Lentos</th><th>Peor</th></tr>
            </thead>
            <tbody>
              {rows.map(([id, s]) => {
                const fps = Math.round((1000 * s.frames) / s.time);
                return (
                  <tr key={id} className={fps < 45 ? "bad" : fps < 55 ? "meh" : ""}>
                    <td>{label(id)}</td>
                    <td>{fps}</td>
                    <td>{Math.round((100 * s.slow) / s.frames)}%</td>
                    <td>{Math.round(s.worst)}ms</td>
                  </tr>
                );
              })}
              {rows.length === 0 && <tr><td colSpan={4}>Haz scroll por toda la página…</td></tr>}
            </tbody>
          </table>
          <div className="dbg-flags">
            {Object.entries(DEBUG_FLAGS).map(([k, txt]) => (
              <label key={k}>
                <input type="checkbox" checked={flags.has(k)} onChange={() => toggle(k)} /> {txt}
              </label>
            ))}
          </div>
          <div className="dbg-actions">
            <button onClick={() => { stats.current = {}; setRows([]); }}>Reiniciar</button>
            <button onClick={() => navigator.clipboard?.writeText(report()).then(() => alert("Copiado"), () => prompt("Copia esto:", report()))}>
              Copiar resultados
            </button>
          </div>
        </>
      )}
    </div>
  );
}
