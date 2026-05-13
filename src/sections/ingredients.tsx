"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const INGREDIENTS = [
  { label: "Noodles",   sub: "Slapped at dawn",      bg: "#e8a93c", text: "#1a1410", pattern: "noodle"   },
  { label: "Broth",     sub: "18hr Tonkotsu",        bg: "#a82711", text: "#fef3d9", pattern: "broth"    },
  { label: "Egg",       sub: "Ajitama 6m30s",        bg: "#f5c451", text: "#1a1410", pattern: "egg"      },
  { label: "Chashu",    sub: "Rolled belly",         bg: "#c9885c", text: "#1a1410", pattern: "chashu"   },
  { label: "Scallion",  sub: "Sliced à la minute",   bg: "#6b8e3d", text: "#fef3d9", pattern: "scallion" },
  { label: "Chili oil", sub: "Toasted szechuan",     bg: "#d83a1c", text: "#fef3d9", pattern: "chili"    },
];

export function Ingredients() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const t = track.current;
      const r = root.current;
      if (!t || !r) return;

      const getScrollDist = () => Math.max(0, t.scrollWidth - window.innerWidth);

      const tween = gsap.to(t, {
        x: () => -getScrollDist(),
        ease: "none",
        scrollTrigger: {
          trigger: r,
          start: "top top",
          end: () => `+=${getScrollDist()}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      // Reveal each card label as it enters the viewport horizontally
      gsap.utils.toArray<HTMLElement>(".ingredient-card").forEach((card) => {
        const label = card.querySelector(".ingredient-label");
        if (!label) return;
        gsap.fromTo(
          label,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "expo.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: "left 80%",
              end: "right 30%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="craft"
      ref={root}
      className="relative h-screen w-full overflow-hidden bg-cream"
    >
      <div className="absolute top-8 left-6 md:left-10 z-10 flex items-center gap-4">
        <span className="sticker text-chili">
          <span className="size-1.5 rounded-full bg-chili" /> Six ingredients
        </span>
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-char/60">
          ← scroll →
        </span>
      </div>

      <div
        ref={track}
        className="flex h-full items-center gap-6 pl-6 md:pl-10 will-change-transform"
        style={{ width: "max-content" }}
      >
        <div className="flex flex-col justify-center pr-12 md:pr-24 max-w-[80vw]">
          <h2 className="display text-char text-[clamp(3rem,10vw,10rem)] leading-[0.85]">
            Six things.
            <br />
            <span className="text-chili">Done right.</span>
          </h2>
          <p className="mt-8 max-w-md text-lg text-char/70">
            We don&apos;t do specials. We don&apos;t do swap-outs. We do these six things, every day, the same way.
          </p>
        </div>

        {INGREDIENTS.map((ing, i) => (
          <div
            key={ing.label}
            className="ingredient-card relative shrink-0 h-[70vh] w-[60vw] md:w-[36vw] rounded-3xl overflow-hidden flex flex-col justify-between p-8 md:p-10"
            style={{ background: ing.bg, color: ing.text }}
          >
            <Pattern kind={ing.pattern} color={ing.text} />
            <div className="relative z-10 flex justify-between items-start">
              <span className="font-mono text-xs uppercase tracking-[0.25em] opacity-70">
                №{String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.25em] opacity-70">
                {ing.sub}
              </span>
            </div>
            <div className="ingredient-label relative z-10">
              <h3 className="display text-[clamp(3rem,7vw,7rem)] leading-none">
                {ing.label}
              </h3>
            </div>
          </div>
        ))}

        <div className="shrink-0 w-[20vw]" />
      </div>
    </section>
  );
}

function Pattern({ kind, color }: { kind: string; color: string }) {
  if (kind === "noodle") {
    return (
      <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
        {Array.from({ length: 10 }).map((_, i) => (
          <path
            key={i}
            d={`M0,${40 + i * 35} C 100,${20 + i * 35} 200,${60 + i * 35} 300,${30 + i * 35} S 500,${40 + i * 35} 600,${30 + i * 35}`}
            stroke={color}
            strokeWidth="3"
            fill="none"
          />
        ))}
      </svg>
    );
  }
  if (kind === "broth") {
    return (
      <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none" viewBox="0 0 400 400">
        {Array.from({ length: 6 }).map((_, i) => (
          <circle key={i} cx={200} cy={200} r={40 + i * 30} stroke={color} strokeWidth="2" fill="none" />
        ))}
      </svg>
    );
  }
  if (kind === "egg") {
    return (
      <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none" viewBox="0 0 400 400">
        <circle cx="200" cy="220" r="160" fill={color} opacity="0.15" />
        <circle cx="200" cy="220" r="90"  fill={color} opacity="0.3" />
        <circle cx="200" cy="220" r="40"  fill={color} opacity="0.5" />
      </svg>
    );
  }
  if (kind === "chashu") {
    return (
      <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none" viewBox="0 0 400 400">
        {Array.from({ length: 6 }).map((_, i) => (
          <ellipse key={i} cx="200" cy="200" rx={150 - i * 22} ry={110 - i * 15} stroke={color} strokeWidth="2" fill="none" />
        ))}
      </svg>
    );
  }
  if (kind === "scallion") {
    return (
      <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" viewBox="0 0 400 400">
        {Array.from({ length: 30 }).map((_, i) => (
          <circle key={i} cx={(i * 53) % 400} cy={(i * 79) % 400} r={4 + (i % 4) * 2} stroke={color} strokeWidth="1.5" fill="none" />
        ))}
      </svg>
    );
  }
  return (
    <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none" viewBox="0 0 400 400">
      {Array.from({ length: 14 }).map((_, i) => (
        <path key={i} d={`M${(i * 47) % 400},${(i * 71) % 400} q 6,-2 18,4 q 14,8 6,18 q -8,8 -18,-4 q -8,-10 -6,-18 z`} fill={color} opacity="0.6" />
      ))}
    </svg>
  );
}
