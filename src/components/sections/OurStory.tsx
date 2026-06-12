"use client";

import { motion } from "framer-motion";

const milestones = [
  { year: "1999", text: "Founded in the heart of Thousand Lights, Chennai" },
  { year: "2000s", text: "Became the neighbourhood's favourite after-college hangout" },
  { year: "2010s", text: "Grew to 1,000+ regulars. Still the same recipes, the same warmth." },
  { year: "Today", text: "4.4★ · 1,500+ reviews · Chennai's OG coffee destination" },
];

export function OurStory() {
  return (
    <section id="story" className="relative bg-espresso py-28 px-6 overflow-hidden">
      {/* Large background text */}
      <div
        className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
        aria-hidden
      >
        <span
          className="font-display font-bold text-[22vw] leading-none text-cream/[0.025] tracking-tighter whitespace-nowrap"
          style={{ userSelect: "none" }}
        >
          Est. 1999
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Left: headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65 }}
          >
            <p className="font-sans text-xs font-medium tracking-[0.3em] uppercase text-caramel/70 mb-6">
              Our Story
            </p>
            <h2 className="font-display font-light text-[clamp(3rem,7vw,6rem)] leading-[0.95] text-cream mb-8">
              A quarter <br />
              century of <br />
              <span className="italic text-caramel">great coffee.</span>
            </h2>
            <p className="font-sans text-base text-cream/50 leading-relaxed max-w-sm">
              What started as a simple coffee shop in 1999 became Chennai&apos;s most beloved cafe.
              Not because we chased trends — but because we never stopped caring about the cup in
              front of you.
            </p>
          </motion.div>

          {/* Right: milestones */}
          <motion.div
            className="flex flex-col gap-0"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          >
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                className="flex gap-8 items-start py-8 border-b border-bark/20 last:border-0"
                variants={{
                  hidden: { opacity: 0, x: 20 },
                  show: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.5, ease: "easeOut" as const },
                  },
                }}
              >
                <span className="font-display italic text-3xl text-caramel/60 w-20 shrink-0 pt-1">
                  {m.year}
                </span>
                <p className="font-sans text-base text-cream/60 leading-relaxed">{m.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
