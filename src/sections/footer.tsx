"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function Footer() {
  const root = useRef<HTMLElement>(null);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".giant-slurp",
        { yPercent: 60, scaleX: 0.9 },
        {
          yPercent: 0,
          scaleX: 1,
          ease: "expo.out",
          duration: 1.4,
          scrollTrigger: { trigger: root.current, start: "top 70%" },
        },
      );
      gsap.to(".giant-slurp", {
        backgroundPosition: "200% 50%",
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={root} className="relative bg-char text-cream pt-24 pb-10 overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="display text-cream text-3xl md:text-4xl mb-6">
              Newsletter for slurpers.
            </h3>
            <p className="text-cream/60 max-w-md mb-8">
              One email a month. New bowls, late-night events, the occasional broth-related opinion. No spam.
            </p>
            <form
              className="flex gap-3 max-w-md"
              onSubmit={(e) => {
                e.preventDefault();
                if (!email) return;
                setDone(true);
                setEmail("");
                setTimeout(() => setDone(false), 3000);
              }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@hungry.com"
                className="flex-1 bg-transparent border-b border-cream/30 px-2 py-3 text-cream placeholder:text-cream/30 focus:outline-none focus:border-chili transition-colors"
              />
              <button
                type="submit"
                className="rounded-full bg-chili px-6 py-3 text-sm font-mono uppercase tracking-wider text-cream hover:bg-cream hover:text-chili transition-colors"
              >
                {done ? "Sent ✓" : "Subscribe"}
              </button>
            </form>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:justify-self-end">
            <FooterCol
              title="Visit"
              links={[
                { label: "Hours", href: "#visit" },
                { label: "Map", href: "https://maps.google.com/?q=188+Allen+St+New+York" },
                { label: "Phone", href: "tel:+12125551234" },
              ]}
            />
            <FooterCol
              title="Site"
              links={[
                { label: "Menu", href: "#menu" },
                { label: "Story", href: "#story" },
                { label: "Craft", href: "#craft" },
              ]}
            />
            <FooterCol
              title="Social"
              links={[
                { label: "Instagram", href: "#" },
                { label: "TikTok", href: "#" },
                { label: "Resy", href: "#" },
              ]}
            />
          </div>
        </div>

        <div
          className="giant-slurp display leading-[0.85] tracking-tight text-center select-none"
          style={{
            fontSize: "clamp(4rem, 22vw, 20rem)",
            backgroundImage:
              "linear-gradient(90deg, #fef3d9 0%, #d83a1c 40%, #f17b2e 60%, #fef3d9 100%)",
            backgroundSize: "200% 100%",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            backgroundPosition: "0% 50%",
            lineHeight: 0.9,
          }}
        >
          SLURP<span style={{ color: "#d83a1c", WebkitTextFillColor: "#d83a1c" }}>°</span>
        </div>

        <div className="mt-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t border-cream/10 pt-8 font-mono text-xs uppercase tracking-[0.2em] text-cream/50">
          <span>© 2026 SLURP° — A fictional ramen bar.</span>
          <span>Made with broth & GSAP.</span>
          <span>188 Allen St · NYC</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-cream/40 mb-4">
        {title}
      </h4>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              className="text-cream/90 hover:text-chili transition-colors"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
