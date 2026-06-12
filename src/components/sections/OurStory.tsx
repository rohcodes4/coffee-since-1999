"use client";

import { motion } from "framer-motion";

const milestones = [
  { year: "1999", text: "Three brothers, a Krups home machine, and no experience. Coffee? opens on Greenways Road with a short vegetarian menu. Friends bring friends. The Hindu calls it the spark that ignited the city's café culture." },
  { year: "2008", text: "The doors close. Nirav moves to Mumbai. His films go to Dhoom, Billa, Tenet. Chennai moves on. But the regulars never quite forget." },
  { year: "2021", text: "On a whim, the brothers reunite. New address in Thousand Lights. A Sanremo Opera 2.0 replaces the Krups. Same soul, serious coffee." },
  { year: "The Craft", text: "V60. Chemex. Aeropress. Kalita. Specialty brewing done properly, because the cup in front of you deserves it." },
  { year: "Today", text: "A third place. Between home and work. Open mic nights, pour-overs at 3pm, and a football turf next door." },
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
              Closed for <br />
              13 years. <br />
              <em
                className="italic text-caramel"
                style={{ fontVariationSettings: '"opsz" 120' }}
              >
                Worth the wait.
              </em>
            </h2>
            <p className="font-sans text-sm text-paper/50 leading-relaxed max-w-xs">
              Three brothers started this with a Krups machine and the courage that comes from
              having no experience. The Hindu said it ignited the city&apos;s café culture. Then
              in 2008, the doors closed. Nirav&apos;s film career took him to Mumbai, to Bollywood
              blockbusters, to Christopher Nolan. Bhavesh stayed in Chennai. The city moved on,
              but the regulars never forgot.
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
