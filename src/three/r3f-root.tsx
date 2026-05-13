"use client";

import { useEffect, useState } from "react";
import { useGLTF, useProgress } from "@react-three/drei";

useGLTF.preload("/classic_ramen.glb");

/** Minimal loader overlay using drei's useProgress. */
export function R3FRoot() {
  return <SlurpLoader />;
}

function SlurpLoader() {
  const { progress, active } = useProgress();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!active && progress >= 100) {
      const t = window.setTimeout(() => setHidden(true), 600);
      return () => window.clearTimeout(t);
    }
  }, [active, progress]);

  if (hidden) return null;

  const done = !active && progress >= 100;

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-cream transition-opacity duration-500"
      style={{
        opacity: done ? 0 : 1,
        pointerEvents: done ? "none" : "auto",
      }}
    >
      <span
        className="display tracking-tight"
        style={{
          fontSize: "clamp(3rem, 10vw, 8rem)",
          color: "#1a1410",
          lineHeight: 1,
        }}
      >
        SLURP
        <span style={{ color: "#d83a1c" }}>°</span>
      </span>
      <div className="mt-8 w-56 max-w-[60vw] h-px bg-char/15 overflow-hidden">
        <div
          className="h-full bg-chili"
          style={{
            width: `${Math.min(100, Math.round(progress))}%`,
            transition: "width 0.25s ease-out",
          }}
        />
      </div>
      <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-char/60">
        Slurping… {Math.round(progress)}%
      </div>
    </div>
  );
}
