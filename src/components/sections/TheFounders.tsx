"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const founders = [
  {
    name: "Nirav Shah",
    role: "Co-founder · Cinematographer",
    credits: "Dhoom · Billa · 2.0 · Tenet",
    bio: "Award-winning cinematographer. Tamil Nadu State Award for Billa. Worked with Christopher Nolan on Tenet. The creative vision behind the 2021 comeback and the design of the space.",
    img: "https://houseofstarss.com/cms/uploads/artist/profile/nirav-shah/Nirav-Shah-01.webp",
  },
  {
    name: "Bhavesh Shah",
    role: "Co-founder · The Constant",
    credits: "Satyam Cinemas · Behind the Counter",
    bio: "Ran the original counter from day one. Kept the Coffee? spirit alive while Nirav was in Mumbai, even supplying cold coffee to Satyam Cinemas. Co-led the 2021 relaunch with wife Mona.",
    img: "https://media.gettyimages.com/id/90513737/photo/bhavesh-shah-the-partner-of-coffee-or-food-restaurant-at-greenways-road-in-chennai-tamil-nadu.jpg?s=594x594&w=0&k=20&c=IaAGIqsrON-T0tYXWOe51y2BknuNE20zdn2PrcQ8lIk=",
  },
  {
    name: "Pratik Shah",
    role: "Co-founder",
    credits: "1999 · 2008 · 2021",
    bio: "Third brother. Stayed in Chennai through it all, from the first cup poured on Greenways Road in 1999 to the last one in 2008. Back again in 2021, because some things are worth coming back for.",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=600&fit=crop&q=85",
  },
];

export function TheFounders() {
  return (
    <section className="bg-paper py-28 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          className="mb-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <span className="font-sans text-[10px] font-semibold tracking-[0.35em] uppercase text-caramel block mb-4">
              The People Behind It
            </span>
            <h2
              className="font-display font-light text-ink leading-[0.9]"
              style={{ fontSize: "clamp(3rem, 8vw, 6.5rem)", fontVariationSettings: '"opsz" 100' }}
            >
              Three brothers.{" "}
              <em className="italic text-ink-3" style={{ fontVariationSettings: '"opsz" 100' }}>
                One idea.
              </em>
            </h2>
          </div>
          <p className="font-sans text-sm text-ink-3 leading-relaxed max-w-xs sm:text-right sm:mb-2 italic">
            &ldquo;Founded with the courage that comes from having no experience.&rdquo;
          </p>
        </motion.div>

        {/* Founder cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.13 } } }}
        >
          {founders.map((f) => (
            <motion.div
              key={f.name}
              className="group flex flex-col"
              variants={{
                hidden: { opacity: 0, y: 32 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
              }}
            >
              {/* Portrait image */}
              <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden mb-5 bg-surface">
                <Image
                  src={f.img}
                  alt={f.name}
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                {/* Warm vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
                {/* Credits chip */}
                <div className="absolute bottom-4 left-4 right-4">
                  <span
                    className="font-display italic text-paper/90 block"
                    style={{ fontSize: "0.95rem", fontVariationSettings: '"opsz" 18' }}
                  >
                    {f.credits}
                  </span>
                </div>
              </div>

              {/* Info below image */}
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <h3
                    className="font-display font-medium text-ink leading-tight"
                    style={{ fontSize: "1.4rem", fontVariationSettings: '"opsz" 28' }}
                  >
                    {f.name}
                  </h3>
                </div>
                <p className="font-sans text-[10px] text-caramel uppercase tracking-widest">
                  {f.role}
                </p>
                <p className="font-sans text-sm text-ink-2 leading-relaxed mt-1">
                  {f.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom rule */}
        <motion.p
          className="mt-14 font-sans text-xs text-ink-3 tracking-widest uppercase text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Three brothers · One cafe · 25 years of Chennai coffee culture
        </motion.p>

      </div>
    </section>
  );
}
