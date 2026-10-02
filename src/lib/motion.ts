import gsap from "gsap";

/** Loads and registers ScrollTrigger once (dynamic import keeps it out of the first paint). */
export async function loadScrollTrigger() {
  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  gsap.registerPlugin(ScrollTrigger);
  return ScrollTrigger;
}

/**
 * True when the browser runs scroll-linked animations natively in CSS
 * (animation-timeline). Those stay in sync with the scroll even when Safari
 * caps JavaScript at 30fps (Low Power Mode), so GSAP scrubs are skipped.
 */
export function scrollDriven() {
  return CSS.supports("animation-timeline: view()");
}

export function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
