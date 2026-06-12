"use client";

import { motion } from "framer-motion";

const milestones = [
  { year: "1999", text: "Founded in Thousand Lights — Chennai gets its OG coffee shop." },
  { year: "2000s", text: "Becomes the neighbourhood's favourite post-college hangout. Word spreads." },
  { year: "2010s", text: "A loyal following of regulars. Same recipes. Same warmth. Expanded menu." },
  { year: "2021", text: "Reimagined by cinematographer Nirav Shah — same soul, elevated experience." },
  { year: "Today", text: "4.4★ · 1,500+ reviews · #114 of 5,751 coffeehouses in Chennai." },
];

export function OurStory() {
  return (
    <section
      id="story"
      className="relative bg-espresso py-28 px-6 lg:px-10 overflow-hidden"
    >
      {/* Massive background text */}
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
      >
        <span
          className="font-display font-black text-[25vw] leading-none text-paper/[0.025] tracking-tighter"
          style={{ fontVariationSettings: '"opsz" 144, "WONK" 0' }}
        >
          1999
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-16 lg:gap-24 items-start">

          {/* Left: headline */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65 }}
          >
            <span className="font-sans text-[10px] font-semibold tracking-[0.35em] uppercase text-caramel block mb-6">
              Our Story
            </span>
            <h2
              className="font-display font-light text-paper leading-[0.9] mb-8"
              style={{ fontSize: "clamp(3.5rem, 9vw, 7rem)", fontVariationSettings: '"opsz" 120' }}
            >
              A quarter <br />
              century of <br />
              <em
                className="italic text-caramel"
                style={{ fontVariationSettings: '"opsz" 120, "SOFT" 60' }}
              >
                great coffee.
              </em>
            </h2>
            <p className="font-sans text-sm text-paper/50 leading-relaxed max-w-xs">
              What started as a simple coffee shop in 1999 became Chennai&apos;s most beloved cafe.
              Not because we chased trends — but because we never stopped caring about the cup
              in front of you.
            </p>
          </motion.div>

          {/* Right: milestone list */}
          <motion.div
            className="flex flex-col"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          >
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                className="flex gap-6 items-start py-7 border-b border-paper/10 last:border-0 group"
                variants={{
                  hidden: { opacity: 0, x: 24 },
                  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
                }}
              >
                {/* Year number */}
                <span
                  className="font-display italic text-caramel/70 shrink-0 w-16 pt-0.5 group-hover:text-caramel transition-colors"
                  style={{ fontSize: "1.6rem", fontVariationSettings: '"opsz" 40' }}
                >
                  {m.year}
                </span>
                {/* Divider + text */}
                <div className="flex-1 flex gap-4 items-start pt-2">
                  <div className="w-px self-stretch bg-paper/10 shrink-0 mt-1" />
                  <p className="font-sans text-sm text-paper/60 leading-relaxed group-hover:text-paper/80 transition-colors">
                    {m.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
