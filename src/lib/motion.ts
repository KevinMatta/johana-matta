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

export function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
