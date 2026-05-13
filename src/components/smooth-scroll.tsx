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
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let lenis: Lenis | null = null;
    try {
      lenis = new Lenis({
        autoRaf: false,
        lerp: 0.1,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
        syncTouch: false,
      });
    } catch (err) {
      console.warn("[SmoothScroll] Lenis init failed; native scroll only.", err);
      return;
    }

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const tickerFn = (time: number) => {
      lenis?.raf(time * 1000);
    };
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    // Multi-stage refresh: after fonts, after first paint, after deferred loads
    const refresh = () => ScrollTrigger.refresh();
    const refreshes: number[] = [];
    refreshes.push(window.setTimeout(refresh, 300));
    refreshes.push(window.setTimeout(refresh, 1200));
    refreshes.push(window.setTimeout(refresh, 2800));
    if ("fonts" in document) {
      document.fonts.ready.then(refresh).catch(() => {});
    }

    return () => {
      gsap.ticker.remove(tickerFn);
      refreshes.forEach(window.clearTimeout);
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}
