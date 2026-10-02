import gsap from "gsap";

/** Loads and registers ScrollTrigger once (dynamic import keeps it out of the first paint). */
export async function loadScrollTrigger() {
  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  gsap.registerPlugin(ScrollTrigger);
  return ScrollTrigger;
}

export function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
