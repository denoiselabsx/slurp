"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const LINKS = [
  { label: "Story", href: "#story", n: "01" },
  { label: "Menu", href: "#menu", n: "02" },
  { label: "Craft", href: "#craft", n: "03" },
  { label: "Visit", href: "#visit", n: "04" },
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

  // Lock body scroll AND force-show the nav while the mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      // The nav may be hidden (translateY -100%) from scroll-down behavior.
      // Snap it back to visible so the close button is accessible.
      if (ref.current) {
        gsap.to(ref.current, { y: "0%", duration: 0.25, ease: "power3.out" });
      }
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        ref={ref}
        className={`fixed inset-x-0 top-0 transition-colors ${open ? "z-[70]" : "z-50"}`}
        style={{
          background: open ? "transparent" : "var(--nav-blur)",
          backdropFilter: open ? "none" : "saturate(140%) blur(14px)",
          WebkitBackdropFilter: open ? "none" : "saturate(140%) blur(14px)",
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4 sm:px-6 sm:py-5 md:px-10">
          <a
            href="#top"
            className={`display text-2xl tracking-tight transition-colors relative z-[70] ${
              open
                ? "text-cream hover:text-cream/80"
                : "text-char hover:text-chili"
            }`}
            onClick={() => setOpen(false)}
          >
            SLURP
            <span className={open ? "text-cream" : "text-chili"}>°</span>
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
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={`md:hidden relative z-[70] flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 ${
              open
                ? "bg-cream text-chili shadow-lg"
                : "bg-cream/80 backdrop-blur border border-char/15 text-char"
            }`}
          >
            {/* Two absolutely-positioned bars, both anchored at the button's
                exact center. When closed they offset vertically (hamburger);
                when open they rotate to form a perfectly aligned X. */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 block h-[2.5px] w-6 rounded-full transition-transform duration-300 ease-out"
              style={{
                background: open ? "#d83a1c" : "#1a1410",
                transformOrigin: "center",
                transform: open
                  ? "translate(-50%, -50%) rotate(45deg)"
                  : "translate(-50%, -200%) rotate(0deg)",
              }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 block h-[2.5px] w-6 rounded-full transition-transform duration-300 ease-out"
              style={{
                background: open ? "#d83a1c" : "#1a1410",
                transformOrigin: "center",
                transform: open
                  ? "translate(-50%, -50%) rotate(-45deg)"
                  : "translate(-50%, 100%) rotate(0deg)",
              }}
            />
          </button>
        </div>
      </header>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
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

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!root.current) return;
    if (!tl.current) {
      // Build timeline once, control with play/reverse
      const t = gsap.timeline({ paused: true });
      t.set(root.current, { autoAlpha: 1, pointerEvents: "auto" });
      t.fromTo(
        ".mm-curtain",
        { yPercent: -100 },
        { yPercent: 0, duration: 0.7, ease: "expo.out" },
      );
      t.fromTo(
        ".mm-line > span",
        { yPercent: 110, rotate: 6 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 0.7,
          stagger: 0.07,
          ease: "expo.out",
        },
        "-=0.35",
      );
      t.fromTo(
        ".mm-meta",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: "expo.out" },
        "-=0.2",
      );
      tl.current = t;
    }
    if (open) {
      tl.current.play(0);
    } else {
      // close: just hide quickly
      gsap.to(root.current, {
        autoAlpha: 0,
        duration: 0.25,
        pointerEvents: "none",
        ease: "power3.inOut",
        onStart: () => {
          gsap.to(".mm-curtain", { yPercent: -100, duration: 0.4, ease: "expo.in" });
        },
      });
    }
  }, [open]);

  return (
    <div
      ref={root}
      className="md:hidden fixed inset-0 z-[60] opacity-0 pointer-events-none"
      aria-hidden={!open}
    >
      {/* Curtain background */}
      <div className="mm-curtain absolute inset-0 bg-chili">
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(254,243,217,0.4), transparent 50%), radial-gradient(circle at 80% 80%, rgba(254,243,217,0.25), transparent 50%)",
          }}
        />
      </div>

      <div className="relative h-full flex flex-col px-6 pt-24 pb-10">
        <div className="mm-meta">
          <span
            className="sticker text-cream"
            style={{ borderColor: "rgba(254,243,217,0.4)" }}
          >
            <span className="size-1.5 rounded-full bg-cream" /> Menu
          </span>
        </div>

        <nav className="flex flex-col mt-12 flex-1">
          {LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={onClose}
              className="mm-line group flex items-baseline justify-between gap-4 py-1 overflow-hidden border-b border-cream/15"
            >
              <span
                className="display text-cream block leading-[0.95]"
                style={{ fontSize: "clamp(2.75rem, 14vw, 6rem)" }}
              >
                <span className="block">
                  <span className="inline-block group-hover:translate-x-2 transition-transform duration-300 ease-out">
                    {l.label}
                  </span>
                </span>
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-cream/60 shrink-0 mb-3">
                {l.n}
              </span>
            </a>
          ))}
        </nav>

        <div className="mt-auto pt-8 flex flex-col gap-6">
          <div className="mm-meta flex flex-wrap items-center gap-3">
            <a
              href="#visit"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-full bg-char px-5 py-3 text-xs font-mono uppercase tracking-wider text-cream"
            >
              <span className="size-2 rounded-full bg-chili animate-pulse" />
              Find us
            </a>
            <a
              href="tel:+12125551234"
              className="inline-flex items-center gap-2 rounded-full border border-cream/40 px-5 py-3 text-xs font-mono uppercase tracking-wider text-cream"
            >
              (212) 555-1234
            </a>
          </div>

          <div className="mm-meta flex items-end justify-between text-cream/80">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-cream/50 mb-1">
                Address
              </div>
              <div className="text-sm leading-tight">
                188 Allen St
                <br />
                New York, NY
              </div>
            </div>
            <div className="flex gap-4 text-xs font-mono uppercase tracking-wider">
              <a href="#" className="hover:text-cream">IG</a>
              <a href="#" className="hover:text-cream">TT</a>
              <a href="#" className="hover:text-cream">RSV</a>
            </div>
          </div>

          <div className="mm-meta font-mono text-[10px] uppercase tracking-[0.3em] text-cream/40">
            Open until 2am · Thu–Sat
          </div>
        </div>
      </div>
    </div>
  );
}
