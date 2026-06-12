"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CircleDot } from "lucide-react";
import { cafe } from "@/content/cafe";

// Desktop grid: 4 items in top row, 4 items in bottom row → rectangular box shape
// Row 1: img0(col1,r1-2), img1(col2,r1), img2(col3,r1-2), img3(col4,r1)
// Row 2: img0 cont.,      img4(col2,r2-3), img2 cont.,    img5(col4,r2)
// Row 3: img6(col1,r3),   img4 cont.,      img7(col3,r3), img8(col4,r3)
const desktopGrid = [
  { imgIdx: 0, col: "1", row: "1 / 3" },
  { imgIdx: 1, col: "2", row: "1"     },
  { imgIdx: 2, col: "3", row: "1 / 3" },
  { imgIdx: 3, col: "4", row: "1"     },
  { imgIdx: 4, col: "2", row: "2 / 4" },
  { imgIdx: 5, col: "4", row: "2"     },
  { imgIdx: 6, col: "1", row: "3"     },
  { imgIdx: 7, col: "3", row: "3"     },
  { imgIdx: 8, col: "4", row: "3"     },
] as const;

export function AmbientGallery() {
  return (
    <section className="bg-paper-2 py-24 px-6 lg:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header — large, off-centre */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-sans text-[10px] font-semibold tracking-[0.35em] uppercase text-caramel block mb-3">
              The Space
            </span>
            <h2
              className="font-display font-light text-ink leading-[0.9]"
              style={{ fontSize: "clamp(3rem, 8vw, 7rem)", fontVariationSettings: '"opsz" 120' }}
            >
              Where Chennai <br />
              comes to <br />
              <em
                className="italic"
                style={{ fontVariationSettings: '"opsz" 120' }}
              >
                exhale.
              </em>
            </h2>
          </motion.div>

          <motion.div
            className="lg:max-w-xs lg:mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="font-sans text-sm text-ink-2 leading-relaxed mb-3">
              Cozy AC interiors, breezy outdoor tables, Sanremo espresso on the counter, and glass
              walls overlooking a live football turf. Open mic nights on the weekends. Open from 8 AM,
              every single day.
            </p>
            <div className="flex items-center gap-3">
              <CircleDot size={16} className="text-caramel shrink-0" />
              <span className="font-sans text-xs text-ink-3">Football turf view · Chennai&apos;s most unique cafe feature</span>
            </div>
          </motion.div>
        </div>

        {/* Mobile/tablet: 2–3 col CSS columns */}
        <div className="lg:hidden columns-2 md:columns-3 gap-3 [column-fill:_balance]">
          {cafe.gallery.map((img, i) => (
            <motion.div
              key={i}
              className="break-inside-avoid mb-3 rounded-xl overflow-hidden group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.07 }}
            >
              <div
                className="relative overflow-hidden"
                style={{
                  paddingBottom:
                    img.aspect === "portrait"  ? "140%" :
                    img.aspect === "landscape" ? "66%"  : "100%",
                }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/15 transition-colors duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop: explicit 4-col grid — 4 items in top row, 4 items in bottom row */}
        <div
          className="hidden lg:grid gap-3"
          style={{
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "260px 200px 220px",
          }}
        >
          {desktopGrid.map(({ imgIdx, col, row }, i) => {
            const img = cafe.gallery[imgIdx];
            return (
              <motion.div
                key={imgIdx}
                className="relative rounded-xl overflow-hidden group cursor-pointer"
                style={{ gridColumn: col, gridRow: row }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                whileHover={{ scale: 1.01 }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="25vw"
                />
                <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/15 transition-colors duration-300 flex items-end p-3">
                  <span className="font-sans text-xs text-paper opacity-0 group-hover:opacity-100 transition-opacity duration-300 leading-tight">
                    {img.alt}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom quote */}
        <motion.blockquote
          className="mt-14 max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span
            className="font-display italic text-ink-2 block"
            style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)", fontVariationSettings: '"opsz" 50' }}
          >
            &ldquo;Coffee lovers should definitely check this place. The coffee is legit and great.&rdquo;
          </span>
          <cite className="font-sans text-xs text-ink-3 not-italic mt-3 block tracking-wider uppercase">
            Google Review
          </cite>
        </motion.blockquote>
      </div>
    </section>
  );
}
