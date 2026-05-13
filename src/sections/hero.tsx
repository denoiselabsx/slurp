"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { Suspense } from "react";
import { HeroBowlScene } from "@/three/bowl-scene";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type ProgressBox = { value: number };

function HeroCamera({ progress }: { progress: ProgressBox }) {
  const { camera, size } = useThree();
  const isMobile = size.width < 768;

  useFrame(() => {
    const p = progress.value;
    // Bowl at world origin (0,0,0). To project the bowl to the right side of
    // the canvas, the camera looks LEFT of the bowl. A larger camera-distance
    // makes the bowl appear smaller on screen, leaving margin around it.
    // Tuned so bowl occupies roughly viewport x: 62% → 90% on desktop.
    const startPos = isMobile
      ? new THREE.Vector3(0, 1.3, 4.6)
      : new THREE.Vector3(-1.7, 1.0, 4.6);
    const endPos = isMobile
      ? new THREE.Vector3(0, 2.2, 3.2)
      : new THREE.Vector3(-1.1, 1.6, 3.6);
    const pos = startPos.clone().lerp(endPos, p);
    camera.position.lerp(pos, 0.18);
    const target = isMobile
      ? new THREE.Vector3(0, 0, 0)
      : new THREE.Vector3(-1.7, 0, 0);
    camera.lookAt(target);
  });
  return null;
}

function BowlInteractor({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });
  // Track touch state separately so drag is sticky (doesn't reset on release).
  const touchRotation = useRef({ x: 0, y: 0 });
  const dragState = useRef<{
    dragging: boolean;
    lastX: number;
    lastY: number;
  }>({ dragging: false, lastX: 0, lastY: 0 });
  const { size } = useThree();

  useEffect(() => {
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;

    if (!isCoarse) {
      // Desktop: gentle parallax tilt following the cursor
      const onMove = (e: PointerEvent) => {
        const nx = (e.clientX / size.width) * 2 - 1;
        const ny = (e.clientY / size.height) * 2 - 1;
        target.current.x = ny * 0.18;
        target.current.y = nx * 0.45;
      };
      window.addEventListener("pointermove", onMove);
      return () => window.removeEventListener("pointermove", onMove);
    }

    // Touch: drag-to-rotate. We attach handlers to the hero section itself
    // (not the canvas wrapper) so CTAs in the content layer still get tapped.
    // We only consume horizontal drags; vertical drags pass through to scroll.
    const wrapper = document.querySelector(".hero-section") as HTMLElement | null;
    if (!wrapper) return;

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      dragState.current.dragging = true;
      dragState.current.lastX = t.clientX;
      dragState.current.lastY = t.clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!dragState.current.dragging) return;
      const t = e.touches[0];
      if (!t) return;
      const dx = t.clientX - dragState.current.lastX;
      const dy = t.clientY - dragState.current.lastY;
      // If horizontal motion dominates, treat as rotate and consume the event
      // so the page doesn't scroll. Otherwise let scroll happen.
      if (Math.abs(dx) > Math.abs(dy) * 1.2) {
        e.preventDefault();
        touchRotation.current.y += dx * 0.012;
        touchRotation.current.x += dy * 0.008;
        dragState.current.lastX = t.clientX;
        dragState.current.lastY = t.clientY;
      } else {
        // It's a scroll gesture — release the drag
        dragState.current.dragging = false;
      }
    };
    const onTouchEnd = () => {
      dragState.current.dragging = false;
    };

    wrapper.addEventListener("touchstart", onTouchStart, { passive: true });
    wrapper.addEventListener("touchmove", onTouchMove, { passive: false });
    wrapper.addEventListener("touchend", onTouchEnd);
    wrapper.addEventListener("touchcancel", onTouchEnd);

    return () => {
      wrapper.removeEventListener("touchstart", onTouchStart);
      wrapper.removeEventListener("touchmove", onTouchMove);
      wrapper.removeEventListener("touchend", onTouchEnd);
      wrapper.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [size.width, size.height]);

  useFrame(() => {
    if (!group.current) return;
    // Desktop tilt is a soft easing to (target). Touch rotation is additive.
    group.current.rotation.x +=
      (target.current.x + touchRotation.current.x - group.current.rotation.x) *
      0.08;
    group.current.rotation.y +=
      (target.current.y + touchRotation.current.y - group.current.rotation.y) *
      0.08;
  });

  return <group ref={group}>{children}</group>;
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const progress = useRef<ProgressBox>({ value: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useGSAP(
    () => {
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
        {
          scale: 1,
          rotate: -2,
          opacity: 1,
          duration: 0.7,
          delay: 0.55,
          ease: "back.out(2)",
        },
      );
      gsap.fromTo(
        ".hero-meta",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.85,
          stagger: 0.1,
          ease: "expo.out",
        },
      );

      const trigger = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom top",
        scrub: 0.6,
        onUpdate: (self) => {
          progress.current.value = self.progress;
        },
      });

      gsap.to(".hero-content", {
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
        y: -100,
        opacity: 0,
        ease: "none",
      });

      gsap.to(".hero-canvas", {
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom 60%",
          scrub: 0.6,
        },
        opacity: 0,
        ease: "none",
      });

      return () => trigger.kill();
    },
    { scope: root },
  );

  return (
    <section
      id="top"
      ref={root}
      className="hero-section relative min-h-[100svh] w-full overflow-hidden bg-cream"
    >
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

      {/* 3D Canvas — full bleed, fades on scroll */}
      <div className="hero-canvas absolute inset-0 pointer-events-none">
        {mounted && (
          <Canvas
            shadows
            dpr={[1, 1.75]}
            gl={{
              antialias: false,
              powerPreference: "high-performance",
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.15,
              alpha: true,
            }}
            style={{ background: "transparent" }}
          >
            <PerspectiveCamera makeDefault position={[0.2, 1.0, 3.2]} fov={35} />
            <HeroCamera progress={progress.current} />
            <Suspense fallback={null}>
              <BowlInteractor>
                <HeroBowlScene />
              </BowlInteractor>
            </Suspense>
          </Canvas>
        )}
      </div>

      <div className="hero-content relative z-10 mx-auto flex min-h-[100svh] max-w-[1600px] flex-col justify-between px-5 pb-10 pt-24 sm:px-6 sm:pb-12 sm:pt-28 md:px-10 md:pt-32">
        <div className="flex flex-wrap items-center gap-3">
          <span className="hero-sticker sticker text-chili text-[10px] sm:text-xs">
            <span className="size-1.5 rounded-full bg-chili animate-pulse" />
            Broth on the stove since 4:18am
          </span>
          <span className="hero-sticker hidden md:inline-flex font-mono text-[10px] uppercase tracking-[0.25em] text-char/45">
            Lower East Side, NYC · Twelve seats, no reservations
          </span>
        </div>

        <h1
          className="display text-char leading-[0.84] tracking-tight max-w-[62vw] md:max-w-none"
          style={{ fontSize: "clamp(3rem, 13vw, 13rem)" }}
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

        <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <div className="hero-meta max-w-md space-y-2 text-[15px] md:text-lg leading-snug text-char/85 font-mono">
            <p className="flex items-baseline gap-3">
              <span className="text-chili font-bold text-lg md:text-xl shrink-0">→</span>
              <span>Pork bone broth. Simmered until sunrise.</span>
            </p>
            <p className="flex items-baseline gap-3">
              <span className="text-chili font-bold text-lg md:text-xl shrink-0">→</span>
              <span>Noodles cut while you watch. Eaten while they&apos;re shy.</span>
            </p>
            <p className="flex items-baseline gap-3">
              <span className="text-chili font-bold text-lg md:text-xl shrink-0">→</span>
              <span>
                Twelve seats. One rule:{" "}
                <span className="text-chili font-bold">slurp loud</span>.
              </span>
            </p>
          </div>
          <div className="hero-meta flex flex-col items-start gap-3">
            <a
              href="#menu"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-char px-6 py-3.5 text-sm font-mono uppercase tracking-wider text-cream"
            >
              <span className="absolute inset-0 -translate-x-full bg-chili transition-transform duration-500 ease-out group-hover:translate-x-0" />
              <span className="relative">See the bowls</span>
              <span className="relative grid place-items-center size-6 rounded-full bg-chili text-cream transition-colors group-hover:bg-cream group-hover:text-chili">
                ↓
              </span>
            </a>
            <span className="hidden md:flex items-center gap-2 pl-2 text-[10px] font-mono uppercase tracking-[0.25em] text-char/40">
              <span className="block h-px w-6 bg-char/30" />
              six bowls. that&apos;s the whole menu.
            </span>
          </div>
        </div>
      </div>

    </section>
  );
}
