"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const BOWLS = [
  {
    n: "01",
    name: "OG Tonkotsu",
    price: "$18",
    heat: 1,
    desc: "18-hour pork bone broth. Fresh noodles. Chashu, ajitama, scallion, nori.",
    accent: "#d83a1c",
    broth: "#e6c98a",
    emissive: "#7a3a14",
  },
  {
    n: "02",
    name: "Spicy Miso",
    price: "$19",
    heat: 3,
    desc: "Tonkotsu base, red miso tare, chili oil bloom, ground pork, corn, butter.",
    accent: "#f17b2e",
    broth: "#c25021",
    emissive: "#a82711",
  },
  {
    n: "03",
    name: "Shoyu Classic",
    price: "$17",
    heat: 1,
    desc: "Chicken-dashi broth, double-strength shoyu tare, menma, scallion, nori.",
    accent: "#e8a93c",
    broth: "#9a6a2a",
    emissive: "#3a2410",
  },
  {
    n: "04",
    name: "Black Garlic",
    price: "$20",
    heat: 2,
    desc: "Tonkotsu kuro. Burnt garlic oil floats on top. Smoky, deep, addictive.",
    accent: "#1a1410",
    broth: "#3a2a22",
    emissive: "#1a0a04",
  },
  {
    n: "05",
    name: "Tantanmen",
    price: "$19",
    heat: 4,
    desc: "Sichuan-style sesame & chili. Numbing peppercorn finish. Mapo pork.",
    accent: "#a82711",
    broth: "#a02410",
    emissive: "#6a1408",
  },
  {
    n: "06",
    name: "Veg Shio",
    price: "$16",
    heat: 1,
    desc: "Kombu-shiitake dashi, sea salt tare, charred corn, bok choy, soft egg.",
    accent: "#6b8e3d",
    broth: "#d8c878",
    emissive: "#3a4a18",
  },
];

export function Menu() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".menu-title span",
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1,
          stagger: 0.06,
          ease: "expo.out",
          scrollTrigger: { trigger: ".menu-title", start: "top 80%" },
        },
      );
      gsap.utils.toArray<HTMLElement>(".bowl-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "expo.out",
            delay: (i % 3) * 0.05,
            scrollTrigger: { trigger: card, start: "top 88%" },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section id="menu" ref={root} className="relative bg-cream py-24 md:py-48">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-6 md:px-10">
        <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <span className="sticker text-chili mb-6">
              <span className="size-1.5 rounded-full bg-chili" /> Six bowls. That&apos;s it.
            </span>
            <h2 className="menu-title display text-char text-[clamp(2.5rem,11vw,11rem)] leading-[0.85]">
              <span className="inline-block overflow-hidden">
                <span className="inline-block">The</span>
              </span>{" "}
              <span className="inline-block overflow-hidden">
                <span className="inline-block text-chili">Menu</span>
              </span>
            </h2>
          </div>
          <p className="max-w-sm text-char/70 md:text-right text-sm md:text-base">
            Cash + card. Bowls served until we run out of broth — usually around midnight, sometimes earlier.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
          {BOWLS.map((b) => (
            <BowlCard key={b.n} {...b} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BowlIllustration({ accent, broth }: { accent: string; broth: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id={`g-${accent}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={broth} stopOpacity="1" />
          <stop offset="70%" stopColor={accent} stopOpacity="0.7" />
          <stop offset="100%" stopColor="#1a1410" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`b-${accent}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={broth} />
          <stop offset="100%" stopColor={accent} />
        </radialGradient>
      </defs>
      {/* Glow */}
      <rect width="400" height="400" fill={`url(#g-${accent})`} opacity="0.3" />
      {/* Bowl shadow */}
      <ellipse cx="200" cy="320" rx="150" ry="20" fill="#000" opacity="0.4" />
      {/* Bowl body */}
      <path
        d="M 60 220 Q 60 320 200 320 Q 340 320 340 220 Z"
        fill="#fef3d9"
        stroke="#1a1410"
        strokeWidth="3"
      />
      {/* Bowl rim ring */}
      <ellipse cx="200" cy="220" rx="140" ry="32" fill="#fef3d9" stroke="#1a1410" strokeWidth="3" />
      {/* Broth */}
      <ellipse cx="200" cy="218" rx="130" ry="26" fill={`url(#b-${accent})`} />
      {/* Chili oil dots */}
      {[
        [-40, -8],
        [25, 5],
        [55, -8],
        [-65, 0],
      ].map(([dx, dy], i) => (
        <circle
          key={i}
          cx={200 + dx}
          cy={218 + dy}
          r={5 + (i % 2) * 2}
          fill="#ff6a3a"
          opacity="0.9"
        />
      ))}
      {/* Noodles peek */}
      {Array.from({ length: 5 }).map((_, i) => (
        <path
          key={i}
          d={`M ${150 + i * 22} 215 q -3 -8 6 -16 q 9 -8 14 -2 q 4 6 -2 14`}
          stroke="#f5e0a8"
          strokeWidth="2.5"
          fill="none"
        />
      ))}
      {/* Egg */}
      <ellipse cx="160" cy="208" rx="22" ry="14" fill="#fef3d9" stroke="#e8a93c" strokeWidth="1.5" />
      <circle cx="160" cy="208" r="9" fill="#f5c451" />
      {/* Nori */}
      <path d="M 230 198 L 252 200 L 250 218 L 228 216 Z" fill="#1a2418" />
      {/* Chashu */}
      <ellipse cx="240" cy="222" rx="20" ry="10" fill="#c9885c" stroke="#8a5a38" strokeWidth="1" />
      {/* Scallions */}
      {Array.from({ length: 8 }).map((_, i) => (
        <circle
          key={i}
          cx={150 + (i * 19) % 100}
          cy={218 + ((i * 7) % 8) - 4}
          r="2"
          fill="#6b8e3d"
        />
      ))}
      {/* Steam wisps */}
      {Array.from({ length: 3 }).map((_, i) => (
        <path
          key={i}
          d={`M ${180 + i * 22} 180 q -8 -20 0 -40 q 8 -20 0 -40`}
          stroke="#fef3d9"
          strokeWidth="3"
          fill="none"
          opacity="0.25"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

function BowlCard({
  n,
  name,
  price,
  heat,
  desc,
  accent,
  broth,
}: (typeof BOWLS)[number]) {
  const [hover, setHover] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <article
      ref={cardRef}
      className="bowl-card group relative overflow-hidden rounded-3xl bg-char text-cream"
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      style={{
        boxShadow: hover
          ? `0 30px 60px -20px ${accent}66`
          : "0 10px 30px -10px rgba(0,0,0,0.3)",
        transition: "box-shadow 0.4s var(--ease-out-expo)",
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${accent}55, transparent 65%)`,
        }}
      />

      <div className="relative aspect-square w-full overflow-hidden">
        <BowlIllustration accent={accent} broth={broth} />
      </div>

      <div className="relative p-5 md:p-7">
        <div className="flex items-start justify-between mb-3">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-cream/50">
            {n}
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-cream/50">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} style={{ opacity: i < heat ? 1 : 0.2 }}>
                ▲
              </span>
            ))}
          </span>
        </div>
        <div className="flex items-baseline justify-between mb-3 gap-3">
          <h3 className="display text-2xl md:text-3xl lg:text-4xl">{name}</h3>
          <span className="font-mono text-lg md:text-xl shrink-0" style={{ color: accent }}>
            {price}
          </span>
        </div>
        <p className="text-cream/70 text-xs md:text-sm leading-relaxed">{desc}</p>
      </div>
    </article>
  );
}
