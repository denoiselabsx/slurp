"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, ContactShadows } from "@react-three/drei";
import { Suspense } from "react";
import { RamenBowl } from "@/three/ramen-bowl";
import * as THREE from "three";

const BOWLS = [
  {
    n: "01",
    name: "OG Tonkotsu",
    price: "$18",
    heat: 1,
    desc: "18-hour pork bone broth. Fresh noodles. Chashu, ajitama, scallion, nori.",
    accent: "#d83a1c",
  },
  {
    n: "02",
    name: "Spicy Miso",
    price: "$19",
    heat: 3,
    desc: "Tonkotsu base, red miso tare, chili oil bloom, ground pork, corn, butter.",
    accent: "#f17b2e",
  },
  {
    n: "03",
    name: "Shoyu Classic",
    price: "$17",
    heat: 1,
    desc: "Chicken-dashi broth, double-strength shoyu tare, menma, scallion, nori.",
    accent: "#e8a93c",
  },
  {
    n: "04",
    name: "Black Garlic",
    price: "$20",
    heat: 2,
    desc: "Tonkotsu kuro. Burnt garlic oil floats on top. Smoky, deep, addictive.",
    accent: "#1a1410",
  },
  {
    n: "05",
    name: "Tantanmen",
    price: "$19",
    heat: 4,
    desc: "Sichuan-style sesame & chili. Numbing peppercorn finish. Mapo pork.",
    accent: "#a82711",
  },
  {
    n: "06",
    name: "Veg Shio",
    price: "$16",
    heat: 1,
    desc: "Kombu-shiitake dashi, sea salt tare, charred corn, bok choy, soft egg.",
    accent: "#6b8e3d",
  },
];

function BowlCanvas({ accent }: { accent: string }) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
      camera={{ position: [0, 1.4, 3.6], fov: 38 }}
    >
      <PerspectiveCamera makeDefault position={[0, 1.4, 3.6]} fov={38} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 3]} intensity={1.4} castShadow />
      <directionalLight position={[-2, 1, -2]} intensity={0.5} color={accent} />
      <Suspense fallback={null}>
        <SpinningBowl />
        <ContactShadows position={[0, -0.65, 0]} opacity={0.5} scale={5} blur={2.5} far={3} />
      </Suspense>
    </Canvas>
  );
}

function SpinningBowl() {
  const ref = useRef<THREE.Group>(null);
  useEffect(() => {
    if (!ref.current) return;
    const tween = gsap.to(ref.current.rotation, {
      y: Math.PI * 2,
      duration: 22,
      ease: "none",
      repeat: -1,
    });
    return () => {
      tween.kill();
    };
  }, []);
  return (
    <group ref={ref}>
      <RamenBowl showSteam={false} />
    </group>
  );
}

export function Menu() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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

      gsap.utils.toArray<HTMLElement>(".bowl-card").forEach((card) => {
        gsap.fromTo(
          card,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 85%" },
          },
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="menu" ref={root} className="relative bg-cream py-32 md:py-48">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <span className="sticker text-chili mb-6">
              <span className="size-1.5 rounded-full bg-chili" /> Six bowls. That's it.
            </span>
            <h2 className="menu-title display text-char text-[clamp(3rem,11vw,11rem)] leading-[0.85]">
              <span className="inline-block overflow-hidden">
                <span className="inline-block">The</span>
              </span>{" "}
              <span className="inline-block overflow-hidden">
                <span className="inline-block text-chili">Menu</span>
              </span>
            </h2>
          </div>
          <p className="max-w-sm text-char/70 md:text-right">
            Cash + card. Bowls served until we run out of broth — usually around midnight, sometimes earlier.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {BOWLS.map((b) => (
            <BowlCard key={b.n} {...b} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BowlCard({
  n,
  name,
  price,
  heat,
  desc,
  accent,
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
        boxShadow: hover ? `0 30px 60px -20px ${accent}66` : "0 10px 30px -10px rgba(0,0,0,0.3)",
        transition: "box-shadow 0.4s var(--ease-out-expo)",
      }}
    >
      {/* Accent bg blob */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${accent}55, transparent 65%)`,
        }}
      />

      <div className="relative aspect-square w-full">
        <BowlCanvas accent={accent} />
      </div>

      <div className="relative p-6 md:p-8">
        <div className="flex items-start justify-between mb-4">
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
        <div className="flex items-baseline justify-between mb-4">
          <h3 className="display text-3xl md:text-4xl">{name}</h3>
          <span className="font-mono text-xl" style={{ color: accent }}>
            {price}
          </span>
        </div>
        <p className="text-cream/70 text-sm leading-relaxed">{desc}</p>
      </div>
    </article>
  );
}
