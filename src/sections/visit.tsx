"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const HOURS = [
  { day: "Mon", hrs: "Closed" },
  { day: "Tue", hrs: "6pm – 12am" },
  { day: "Wed", hrs: "6pm – 12am" },
  { day: "Thu", hrs: "6pm – 2am" },
  { day: "Fri", hrs: "6pm – 2am" },
  { day: "Sat", hrs: "5pm – 2am" },
  { day: "Sun", hrs: "5pm – 11pm" },
];

export function Visit() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".visit-title span",
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1,
          stagger: 0.06,
          ease: "expo.out",
          scrollTrigger: { trigger: ".visit-title", start: "top 80%" },
        },
      );
      gsap.utils.toArray<HTMLElement>(".visit-row").forEach((row) => {
        gsap.fromTo(
          row,
          { x: -30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            ease: "expo.out",
            stagger: 0.05,
            scrollTrigger: { trigger: row, start: "top 90%" },
          },
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  // figure out current day-of-week for highlight
  const today = new Date().getDay(); // 0 sun .. 6 sat
  // our array is Mon..Sun so map:
  const todayIndex = today === 0 ? 6 : today - 1;

  return (
    <section
      id="visit"
      ref={root}
      className="relative bg-chili text-cream py-32 md:py-48 overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(254,243,217,0.4), transparent 50%), radial-gradient(circle at 80% 70%, rgba(254,243,217,0.3), transparent 55%)",
        }}
      />

      <div className="relative mx-auto max-w-[1600px] px-6 md:px-10">
        <span className="sticker mb-8">
          <span className="size-1.5 rounded-full bg-cream" /> Visit
        </span>

        <h2 className="visit-title display text-cream text-[clamp(3rem,14vw,14rem)] leading-[0.82]">
          <span className="block overflow-hidden">
            <span className="block">Come get</span>
          </span>
          <span className="block overflow-hidden">
            <span className="block">slurped.</span>
          </span>
        </h2>

        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Hours */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-cream/60 mb-6">
              Hours
            </h3>
            <ul className="divide-y divide-cream/15">
              {HOURS.map((h, i) => (
                <li
                  key={h.day}
                  className={`visit-row flex justify-between py-4 text-2xl md:text-3xl ${
                    i === todayIndex ? "font-bold" : "text-cream/70"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {i === todayIndex && (
                      <span className="size-2 rounded-full bg-cream animate-pulse" />
                    )}
                    {h.day}
                    {i === todayIndex && (
                      <span className="font-mono text-xs uppercase tracking-[0.2em] text-cream/70">
                        Today
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-xl md:text-2xl">{h.hrs}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Address + Map */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-cream/60 mb-6">
              Address
            </h3>
            <p className="display text-cream text-3xl md:text-5xl leading-tight mb-8">
              188 Allen St<br />
              New York, NY 10002
            </p>

            <FauxMap />

            <div className="mt-8 grid grid-cols-2 gap-3">
              <a
                href="https://maps.google.com/?q=188+Allen+St+New+York"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-cream px-5 py-3.5 text-sm font-mono uppercase tracking-wider text-chili hover:bg-char hover:text-cream transition-colors"
              >
                Get directions →
              </a>
              <a
                href="tel:+12125551234"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-cream/40 px-5 py-3.5 text-sm font-mono uppercase tracking-wider text-cream hover:bg-cream hover:text-chili transition-colors"
              >
                (212) 555-1234
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FauxMap() {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-char">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#fef3d9" strokeWidth="0.4" opacity="0.15" />
          </pattern>
        </defs>
        <rect width="400" height="300" fill="#1a1410" />
        <rect width="400" height="300" fill="url(#grid)" />

        {/* Streets */}
        <path d="M 0,150 L 400,150" stroke="#fef3d9" strokeWidth="3" opacity="0.4" />
        <path d="M 200,0 L 200,300" stroke="#fef3d9" strokeWidth="3" opacity="0.4" />
        <path d="M 0,80 L 400,80" stroke="#fef3d9" strokeWidth="1.5" opacity="0.25" />
        <path d="M 0,220 L 400,220" stroke="#fef3d9" strokeWidth="1.5" opacity="0.25" />
        <path d="M 100,0 L 100,300" stroke="#fef3d9" strokeWidth="1.5" opacity="0.25" />
        <path d="M 300,0 L 300,300" stroke="#fef3d9" strokeWidth="1.5" opacity="0.25" />

        {/* Block labels */}
        <text x="50" y="115" fill="#fef3d9" opacity="0.4" fontSize="9" fontFamily="JetBrains Mono">STANTON</text>
        <text x="250" y="115" fill="#fef3d9" opacity="0.4" fontSize="9" fontFamily="JetBrains Mono">RIVINGTON</text>
        <text x="210" y="50" fill="#fef3d9" opacity="0.4" fontSize="9" fontFamily="JetBrains Mono">ALLEN ST</text>

        {/* Marker */}
        <g transform="translate(200,150)">
          <circle r="22" fill="#d83a1c" opacity="0.25">
            <animate attributeName="r" from="22" to="46" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle r="10" fill="#fef3d9" />
          <circle r="5" fill="#d83a1c" />
        </g>
        <text x="216" y="148" fill="#fef3d9" fontSize="11" fontFamily="Archivo Black">SLURP°</text>
      </svg>
    </div>
  );
}
