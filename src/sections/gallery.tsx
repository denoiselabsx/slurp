"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Pure-CSS "photo" tiles — we use rich gradients + SVG illustrations as stand-ins
// for real photography, in keeping with the portfolio-demo brief.

const TILES: { kind: string; ratio: string; label?: string }[] = [
  { kind: "noodles-macro", ratio: "aspect-[3/4]", label: "Fresh-cut" },
  { kind: "broth-pour", ratio: "aspect-[4/5]", label: "The pour" },
  { kind: "neon", ratio: "aspect-[5/4]", label: "Open late" },
  { kind: "counter", ratio: "aspect-[4/5]", label: "Twelve seats" },
  { kind: "chopsticks", ratio: "aspect-square", label: "Slurp." },
  { kind: "egg-yolk", ratio: "aspect-[3/4]", label: "6m 30s" },
  { kind: "steam", ratio: "aspect-[5/6]", label: "Hot." },
  { kind: "menu-board", ratio: "aspect-[4/5]", label: "Six bowls" },
];

export function Gallery() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".tile").forEach((tile, i) => {
        gsap.fromTo(
          tile,
          { y: 60, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: tile, start: "top 90%" },
            delay: (i % 4) * 0.05,
          },
        );
        gsap.to(tile, {
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: tile,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="gallery"
      className="relative bg-cream py-32 md:py-48"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="mb-16 flex items-end justify-between">
          <h2 className="display text-char text-[clamp(2.5rem,8vw,8rem)] leading-[0.85]">
            The
            <br />
            <span className="text-chili">vibes.</span>
          </h2>
          <span className="hidden md:block font-mono text-xs uppercase tracking-[0.25em] text-char/60">
            Lower East Side · NYC
          </span>
        </div>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-6 [column-fill:_balance]">
          {TILES.map((t, i) => (
            <Tile key={i} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Tile({ kind, ratio, label }: { kind: string; ratio: string; label?: string }) {
  return (
    <div
      className={`tile group relative mb-4 md:mb-6 break-inside-avoid overflow-hidden rounded-2xl ${ratio}`}
    >
      <TileArt kind={kind} />
      {label && (
        <div className="absolute inset-0 flex items-end p-4 md:p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-char/70 to-transparent">
          <span className="display text-cream text-2xl md:text-3xl">{label}</span>
        </div>
      )}
    </div>
  );
}

function TileArt({ kind }: { kind: string }) {
  switch (kind) {
    case "noodles-macro":
      return (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 280" preserveAspectRatio="xMidYMid slice">
          <rect width="200" height="280" fill="#e8a93c" />
          {Array.from({ length: 18 }).map((_, i) => (
            <path
              key={i}
              d={`M0,${20 + i * 16} C 50,${10 + i * 16} 100,${30 + i * 16} 150,${15 + i * 16} S 250,${25 + i * 16} 300,${15 + i * 16}`}
              stroke="#1a1410"
              strokeWidth="2.5"
              fill="none"
              opacity={0.5 + (i % 3) * 0.15}
            />
          ))}
        </svg>
      );
    case "broth-pour":
      return (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 250" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="g1" cx="50%" cy="40%" r="70%">
              <stop offset="0%" stopColor="#f17b2e" />
              <stop offset="60%" stopColor="#a82711" />
              <stop offset="100%" stopColor="#1a1410" />
            </radialGradient>
          </defs>
          <rect width="200" height="250" fill="url(#g1)" />
          <circle cx="100" cy="100" r="40" stroke="#fef3d9" strokeWidth="1.5" fill="none" opacity="0.6" />
          <circle cx="100" cy="100" r="60" stroke="#fef3d9" strokeWidth="1" fill="none" opacity="0.4" />
          <circle cx="100" cy="100" r="80" stroke="#fef3d9" strokeWidth="1" fill="none" opacity="0.25" />
        </svg>
      );
    case "neon":
      return (
        <div className="absolute inset-0 bg-char flex items-center justify-center">
          <div className="display text-[18vw] md:text-7xl tracking-tight" style={{ color: "#ff6a3a", textShadow: "0 0 18px #ff6a3a, 0 0 38px #d83a1c" }}>
            SLURP
          </div>
          <div className="absolute inset-0 bg-gradient-to-tr from-chili/30 via-transparent to-orange-hot/20" />
        </div>
      );
    case "counter":
      return (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 250" preserveAspectRatio="xMidYMid slice">
          <rect width="200" height="250" fill="#2a201a" />
          <rect x="0" y="160" width="200" height="90" fill="#c9885c" />
          {Array.from({ length: 6 }).map((_, i) => (
            <rect key={i} x={20 + i * 28} y={140} width="20" height="40" rx="6" fill="#d83a1c" />
          ))}
          <line x1="0" y1="160" x2="200" y2="160" stroke="#1a1410" strokeWidth="3" />
        </svg>
      );
    case "chopsticks":
      return (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice">
          <rect width="200" height="200" fill="#fef3d9" />
          <rect x="40" y="20" width="6" height="160" fill="#1a1410" transform="rotate(20 40 20)" />
          <rect x="60" y="20" width="6" height="160" fill="#1a1410" transform="rotate(25 60 20)" />
          <text x="100" y="190" textAnchor="middle" fill="#d83a1c" fontSize="80" fontFamily="Archivo Black" fontWeight="900">!</text>
        </svg>
      );
    case "egg-yolk":
      return (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 270" preserveAspectRatio="xMidYMid slice">
          <rect width="200" height="270" fill="#fdf2d8" />
          <ellipse cx="100" cy="140" rx="80" ry="70" fill="#fef3d9" />
          <circle cx="100" cy="140" r="48" fill="#f5c451" />
          <circle cx="100" cy="140" r="28" fill="#e8a93c" />
          <circle cx="92" cy="132" r="8" fill="#fef3d9" opacity="0.7" />
        </svg>
      );
    case "steam":
      return (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 250" preserveAspectRatio="xMidYMid slice">
          <rect width="200" height="250" fill="#1a1410" />
          {Array.from({ length: 8 }).map((_, i) => (
            <ellipse
              key={i}
              cx={60 + (i % 3) * 40}
              cy={30 + i * 28}
              rx={30 + (i % 2) * 10}
              ry={14}
              fill="#fef3d9"
              opacity={0.06 + (i % 3) * 0.04}
            />
          ))}
          <rect x="40" y="200" width="120" height="40" rx="60" fill="#d83a1c" />
        </svg>
      );
    case "menu-board":
      return (
        <div className="absolute inset-0 bg-char p-6 flex flex-col justify-between">
          <div className="font-mono text-cream/60 text-[10px] tracking-[0.3em] uppercase">Tonight</div>
          <div className="space-y-1">
            {["Tonkotsu", "Spicy Miso", "Shoyu", "Black Garlic", "Tantanmen", "Veg Shio"].map((n, i) => (
              <div key={n} className="flex justify-between font-mono text-cream text-xs">
                <span>0{i + 1}. {n}</span>
                <span className="text-chili">$1{i + 6}</span>
              </div>
            ))}
          </div>
          <div className="font-mono text-cream/60 text-[10px] tracking-[0.3em] uppercase text-right">∞</div>
        </div>
      );
    default:
      return <div className="absolute inset-0 bg-chili" />;
  }
}
