import gsap from "gsap";
import { dbg } from "./debug";

/** Loads and registers ScrollTrigger once (dynamic import keeps it out of the first paint). */
export async function loadScrollTrigger() {
  // ?debug=noanim → never resolves, so no component starts its animations
  if (dbg("noanim")) return new Promise<never>(() => {});
  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  gsap.registerPlugin(ScrollTrigger);
  if (dbg("normalize")) ScrollTrigger.normalizeScroll(true);
  return ScrollTrigger;
}

/**
 * True when the browser runs scroll-linked animations natively in CSS
 * (animation-timeline). Those stay in sync with the scroll even when Safari
 * caps JavaScript at 30fps (Low Power Mode), so GSAP scrubs are skipped.
 * ?debug=nocss forces the GSAP path for comparison.
 */
export function scrollDriven() {
  return CSS.supports("animation-timeline: view()") && !dbg("nocss");
}

export function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
