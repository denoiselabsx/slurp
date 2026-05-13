"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dotEl = dot.current!;
    const ringEl = ring.current!;

    gsap.set([dotEl, ringEl], { xPercent: -50, yPercent: -50 });

    const xTo = gsap.quickTo(dotEl, "x", { duration: 0.18, ease: "power3" });
    const yTo = gsap.quickTo(dotEl, "y", { duration: 0.18, ease: "power3" });
    const rxTo = gsap.quickTo(ringEl, "x", { duration: 0.55, ease: "power3" });
    const ryTo = gsap.quickTo(ringEl, "y", { duration: 0.55, ease: "power3" });

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      rxTo(e.clientX);
      ryTo(e.clientY);
    };

    const onEnterLink = () => {
      gsap.to(ringEl, { scale: 2.4, duration: 0.3, ease: "power3" });
      gsap.to(dotEl, { scale: 0, duration: 0.2 });
    };
    const onLeaveLink = () => {
      gsap.to(ringEl, { scale: 1, duration: 0.3, ease: "power3" });
      gsap.to(dotEl, { scale: 1, duration: 0.2 });
    };

    window.addEventListener("pointermove", onMove);
    document.querySelectorAll<HTMLElement>("a, button, [data-hover]").forEach((el) => {
      el.addEventListener("pointerenter", onEnterLink);
      el.addEventListener("pointerleave", onLeaveLink);
    });

    // Re-bind hover targets when DOM changes
    const observer = new MutationObserver(() => {
      document.querySelectorAll<HTMLElement>("a, button, [data-hover]").forEach((el) => {
        if (!el.dataset.cursorBound) {
          el.dataset.cursorBound = "1";
          el.addEventListener("pointerenter", onEnterLink);
          el.addEventListener("pointerleave", onLeaveLink);
        }
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dot} className="cursor-dot" />
      <div
        ref={ring}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: 999,
          border: "1.5px solid var(--color-chili)",
          pointerEvents: "none",
          zIndex: 199,
          willChange: "transform",
        }}
      />
    </>
  );
}
