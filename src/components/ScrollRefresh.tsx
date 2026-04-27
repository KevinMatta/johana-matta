"use client";

import { useEffect } from "react";

export default function ScrollRefresh() {
  useEffect(() => {
    const refresh = async () => {
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      ScrollTrigger.refresh();
    };

    // Refresh after all images/fonts finish loading
    if (document.readyState === "complete") {
      refresh();
    } else {
      window.addEventListener("load", refresh, { once: true });
    }

    // Second refresh after a short delay for any late-rendering elements
    const t = setTimeout(refresh, 800);
    return () => clearTimeout(t);
  }, []);

  return null;
}
