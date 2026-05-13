"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let lenis: Lenis | null = null;
    let rafId: number | null = null;

    if (!reduce) {
      try {
        lenis = new Lenis({
          duration: 1.1,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 1.5,
        });

        const raf = (time: number) => {
          lenis?.raf(time);
          rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);

        lenis.on("scroll", () => ScrollTrigger.update());
      } catch (err) {
        console.warn("[SmoothScroll] Lenis init failed; falling back to native scroll.", err);
        lenis = null;
      }
    }

    // Always refresh ScrollTrigger after layout settles (fonts, images, R3F mount)
    const refresh = () => ScrollTrigger.refresh();
    const t1 = window.setTimeout(refresh, 200);
    const t2 = window.setTimeout(refresh, 1000);
    const t3 = window.setTimeout(refresh, 2200);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      if (rafId !== null) cancelAnimationFrame(rafId);
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}
