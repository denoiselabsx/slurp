"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const LINKS = [
  { label: "Story", href: "#story" },
  { label: "Menu", href: "#menu" },
  { label: "Craft", href: "#craft" },
  { label: "Visit", href: "#visit" },
];

export function Nav() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let lastY = 0;
    let hidden = false;
    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastY && y > 200;
      if (goingDown && !hidden) {
        hidden = true;
        gsap.to(el, { y: "-100%", duration: 0.4, ease: "power3.out" });
      } else if (!goingDown && hidden) {
        hidden = false;
        gsap.to(el, { y: "0%", duration: 0.4, ease: "power3.out" });
      }
      el.style.setProperty(
        "--nav-blur",
        y > 60 ? "rgba(254,243,217,0.78)" : "rgba(254,243,217,0)",
      );
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={ref}
      className="fixed inset-x-0 top-0 z-50 transition-colors"
      style={{
        background: "var(--nav-blur)",
        backdropFilter: "saturate(140%) blur(14px)",
        WebkitBackdropFilter: "saturate(140%) blur(14px)",
      }}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-10">
        <a
          href="#top"
          className="display text-2xl tracking-tight text-char hover:text-chili transition-colors"
        >
          SLURP<span className="text-chili">°</span>
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <NavLink key={l.href} {...l} />
          ))}
        </nav>

        <a
          href="#visit"
          className="hidden md:inline-flex items-center gap-2 rounded-full bg-char px-5 py-2.5 text-sm font-mono uppercase tracking-wider text-cream hover:bg-chili transition-colors"
        >
          <span className="size-2 rounded-full bg-chili animate-pulse" />
          Find us
        </a>

        <button
          aria-label="Open menu"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden flex flex-col gap-1.5 p-2"
        >
          <span
            className={`h-0.5 w-6 bg-char transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`h-0.5 w-6 bg-char transition-opacity ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`h-0.5 w-6 bg-char transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-char/10 bg-cream/95 backdrop-blur-md">
          <nav className="flex flex-col px-6 py-4">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="display py-3 text-3xl text-char hover:text-chili"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

function NavLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="group relative overflow-hidden px-4 py-2 text-sm font-mono uppercase tracking-wider text-char"
    >
      <span className="block transition-transform duration-300 group-hover:-translate-y-full">
        {label}
      </span>
      <span className="absolute inset-0 flex items-center justify-center text-chili translate-y-full transition-transform duration-300 group-hover:translate-y-0">
        {label}
      </span>
    </a>
  );
}
