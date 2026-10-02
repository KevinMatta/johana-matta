/**
 * Diagnostic switches, enabled only via the URL: ?debug  or  ?debug=nomask,nowords
 * Lets us switch parts of the page off on a real phone to find what causes jank.
 */
export const DEBUG_FLAGS = {
  nomask: "Sin imágenes de ventanas",
  nowords: "Sin ELEGANCIA / EXCELENCIA",
  cssw: "Palabras con CSS (sin JS)",
  noparallax: "Sin parallax",
  noanim: "Sin GSAP (todo apagado)",
  normalize: "normalizeScroll",
} as const;

export type DebugFlag = keyof typeof DEBUG_FLAGS;

export function debugFlags(): Set<string> | null {
  if (typeof window === "undefined") return null;
  const v = new URLSearchParams(window.location.search).get("debug");
  if (v === null) return null;
  return new Set(v.split(",").filter(Boolean));
}

export function dbg(flag: DebugFlag) {
  return debugFlags()?.has(flag) ?? false;
}
