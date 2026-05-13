"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const CHAPTERS = [
  {
    chapter: "01",
    title: "Eighteen hours.",
    body: "We start with pork bone, chicken back, dried sardine, kombu. Boil. Skim. Boil again. By the time the broth is right, the sun has come and gone.",
  },
  {
    chapter: "02",
    title: "Slap. Fold. Rest.",
    body: "Noodles are mixed at dawn, rested under damp cloth, then cut to order. Chewy. Springy. Built to grip the broth.",
  },
  {
    chapter: "03",
    title: "Twelve seats.",
    body: "No reservations. No tables. Just a counter, a kitchen you can watch, and the sound of slurping. That's the whole concept.",
  },
];

export function Story() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".story-card");
      cards.forEach((card, i) => {
        gsap.fromTo(
          card.querySelectorAll(".story-reveal > span"),
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 1,
            stagger: 0.06,
            ease: "expo.out",
            scrollTrigger: {
              trigger: card,
              start: "top 75%",
            },
          },
        );
        gsap.fromTo(
          card.querySelector(".story-body"),
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "expo.out",
            scrollTrigger: {
              trigger: card,
              start: "top 70%",
            },
          },
        );
        gsap.fromTo(
          card.querySelector(".story-chapter"),
          { xPercent: -40, opacity: 0 },
          {
            xPercent: 0,
            opacity: 1,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
            },
          },
        );
      });

      // Pin the "story" giant word on the side as user scrolls
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        pin: ".story-sticky",
        pinSpacing: false,
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="story"
      ref={root}
      className="relative bg-char text-cream py-32 md:py-48"
    >
      <div className="story-sticky pointer-events-none absolute inset-x-0 top-0 h-screen overflow-hidden">
        <div className="absolute -left-6 top-1/2 -translate-y-1/2 display text-[18vw] md:text-[14vw] text-cream/[0.06] leading-none">
          STORY
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-24 flex items-start justify-between">
          <span className="sticker text-orange-hot">
            <span className="size-1.5 rounded-full bg-orange-hot" /> The craft
          </span>
          <span className="hidden md:block font-mono text-xs uppercase tracking-[0.25em] text-cream/50">
            Est. 2026 · Lower East Side
          </span>
        </div>

        <div className="flex flex-col gap-32 md:gap-48">
          {CHAPTERS.map((c) => (
            <article
              key={c.chapter}
              className="story-card grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16"
            >
              <div className="md:col-span-3">
                <span className="story-chapter inline-block display text-orange-hot text-7xl md:text-8xl">
                  {c.chapter}
                </span>
              </div>
              <div className="md:col-span-9">
                <h3 className="display text-cream text-[clamp(2.5rem,7vw,6rem)]">
                  {c.title.split(" ").map((word, i) => (
                    <span key={i} className="story-reveal inline-block overflow-hidden mr-[0.2em]">
                      <span className="inline-block">{word}</span>
                    </span>
                  ))}
                </h3>
                <p className="story-body mt-8 max-w-2xl text-lg md:text-xl text-cream/70 leading-relaxed">
                  {c.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
