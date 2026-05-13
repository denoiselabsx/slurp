"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { useMemo } from "react";
import { Suspense, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { FloatingBowl } from "@/three/ramen-bowl";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

function MouseRotator({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });
  const { size } = useThree();

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / size.width) * 2 - 1;
      const ny = (e.clientY / size.height) * 2 - 1;
      target.current.x = ny * 0.25;
      target.current.y = nx * 0.6;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [size.width, size.height]);

  useFrame(() => {
    if (!group.current) return;
    group.current.rotation.x += (target.current.x - group.current.rotation.x) * 0.06;
    group.current.rotation.y += (target.current.y - group.current.rotation.y) * 0.06;
  });

  return <group ref={group}>{children}</group>;
}

function ResponsiveBowl() {
  const { size } = useThree();
  const isMobile = size.width < 768;
  const props = useMemo(() => {
    if (isMobile) {
      // Center the bowl behind the headline, small and lower-third
      return { position: [0, -1.1, 0] as [number, number, number], scale: 0.7 };
    }
    return { position: [1.7, -0.4, 0] as [number, number, number], scale: 0.85 };
  }, [isMobile]);

  return (
    <>
      <FloatingBowl position={props.position} scale={props.scale} />
      <ContactShadows
        position={[props.position[0], props.position[1] - 0.85 * props.scale, props.position[2]]}
        opacity={0.32}
        scale={4.5}
        blur={2.6}
        far={3}
        color="#1a1410"
      />
    </>
  );
}

function ScrollScaler({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!group.current) return;
    const y = window.scrollY;
    const vh = window.innerHeight;
    const p = Math.min(1, y / vh);
    // Bowl shrinks + drifts down + tilts as you leave the hero
    group.current.position.y = -p * 3.0;
    group.current.scale.setScalar(Math.max(0.001, 1 - p * 0.9));
    group.current.rotation.z = p * 0.4;
  });
  return <group ref={group}>{children}</group>;
}

export function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-reveal > span",
        { yPercent: 110, rotate: 6 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 1.1,
          stagger: 0.08,
          ease: "expo.out",
          delay: 0.2,
        },
      );
      gsap.fromTo(
        ".hero-sticker",
        { scale: 0, rotate: -30, opacity: 0 },
        { scale: 1, rotate: -2, opacity: 1, duration: 0.7, delay: 0.6, ease: "back.out(2)" },
      );
      gsap.fromTo(
        ".hero-meta",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.9,
          stagger: 0.1,
          ease: "expo.out",
        },
      );
      gsap.to(".hero-content", {
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        y: -80,
        opacity: 0,
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="top"
      className="hero-section relative min-h-screen w-full overflow-hidden bg-cream"
      ref={root}
    >
      {/* Background mega-type — very subtle */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 display whitespace-nowrap select-none"
          style={{
            fontSize: "min(38vw, 60vh)",
            lineHeight: 0.85,
            color: "#d83a1c",
            opacity: 0.05,
          }}
          aria-hidden
        >
          SLURP
        </div>
      </div>

      {/* 3D Canvas — full bleed, clipped by section's overflow-hidden */}
      <div className="absolute inset-0">
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
          camera={{ position: [0, 0.5, 4.5], fov: 35 }}
        >
          <ambientLight intensity={0.65} />
          <directionalLight
            position={[3, 6, 4]}
            intensity={1.5}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight position={[-3, 2, -2]} intensity={0.6} color="#ff8a4a" />
          <spotLight
            position={[0, 5, 2]}
            intensity={1.2}
            angle={0.5}
            penumbra={0.8}
            color="#ffd699"
          />

          <Suspense fallback={null}>
            <ScrollScaler>
              <MouseRotator>
                <ResponsiveBowl />
              </MouseRotator>
            </ScrollScaler>
            <Environment preset="warehouse" environmentIntensity={0.5} />
          </Suspense>
        </Canvas>
      </div>

      {/* Content overlay */}
      <div className="hero-content relative z-10 mx-auto flex min-h-screen max-w-[1600px] flex-col justify-between px-5 pb-10 pt-24 sm:px-6 sm:pb-12 sm:pt-28 md:px-10 md:pt-32">
        <div>
          <span className="hero-sticker sticker text-chili text-[10px] sm:text-xs">
            <span className="size-1.5 rounded-full bg-chili" />
            Open until 2am · Thu–Sat
          </span>
        </div>

        {/* Headline — three stacked "slurp." words. On mobile, sit at left over the bowl bg. */}
        <h1
          className="display text-char leading-[0.85] tracking-tight"
          style={{ fontSize: "clamp(3.2rem, 13vw, 13rem)" }}
        >
          <span className="hero-reveal block overflow-hidden">
            <span className="block whitespace-nowrap">slurp.</span>
          </span>
          <span className="hero-reveal block overflow-hidden">
            <span className="block whitespace-nowrap text-chili">slurp.</span>
          </span>
          <span className="hero-reveal block overflow-hidden">
            <span className="block whitespace-nowrap">slurp.</span>
          </span>
        </h1>

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p className="hero-meta max-w-md text-base md:text-lg text-char/75 leading-relaxed">
            A tiny ramen bar on the corner of Allen & Stanton.
            Tonkotsu broth simmered 18 hours. Noodles slapped fresh.
            No reservations. Just{" "}
            <span className="text-chili font-bold">slurp</span>.
          </p>
          <div className="hero-meta flex items-center gap-4">
            <a
              href="#menu"
              className="group inline-flex items-center gap-3 rounded-full bg-char px-6 py-3.5 text-sm font-mono uppercase tracking-wider text-cream hover:bg-chili transition-colors"
            >
              See the bowls
              <span className="grid place-items-center size-6 rounded-full bg-chili text-cream group-hover:bg-cream group-hover:text-chili transition-colors">
                ↓
              </span>
            </a>
            <a
              href="#visit"
              className="hidden md:inline-flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-char/70 hover:text-chili transition-colors"
            >
              Map →
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-2 text-char/60">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">
          Scroll
        </span>
        <span className="block h-10 w-px bg-char/40 animate-pulse" />
      </div>
    </section>
  );
}
