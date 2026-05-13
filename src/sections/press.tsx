"use client";

const PRESS = [
  "Eater",
  "Bon Appétit",
  "The New Yorker",
  "Time Out",
  "NYT Cooking",
  "Infatuation",
  "Resy",
  "Grub Street",
];

export function Press() {
  const row = [...PRESS, ...PRESS];
  return (
    <section className="bg-char text-cream py-10 md:py-14 overflow-hidden border-y border-cream/10">
      <div className="flex items-center gap-6 mb-6 px-6 md:px-10">
        <span className="sticker text-orange-hot">
          <span className="size-1.5 rounded-full bg-orange-hot" /> Featured in
        </span>
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-cream/40">
          ★★★★½ · 412 reviews
        </span>
      </div>
      <div className="overflow-hidden">
        <div className="marquee-track flex w-max items-center gap-16 whitespace-nowrap">
          {row.map((p, i) => (
            <span
              key={i}
              className="display text-[clamp(2rem,6vw,6rem)] text-cream/80 hover:text-chili transition-colors"
            >
              {p}
              <span className="text-chili px-6">●</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
