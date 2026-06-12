"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { MenuCard } from "@/components/ui/MenuCard";
import { signatureItems } from "@/content/cafe";

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const },
  },
};

export function SignatureItems() {
  return (
    <section className="bg-espresso py-28 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <p className="font-sans text-xs font-medium tracking-[0.3em] uppercase text-caramel/70 mb-4">
              The Regulars' Picks
            </p>
            <h2 className="font-display font-light text-[clamp(2.5rem,6vw,5rem)] leading-[1] text-cream">
              Signature <br />
              <span className="italic text-cream/50">Items</span>
            </h2>
          </div>
          <a
            href="/menu"
            className="group inline-flex items-center gap-2 font-sans text-sm text-cream/50 hover:text-caramel transition-colors duration-200 md:mb-2"
          >
            View full menu
            <ArrowRight
              size={15}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </a>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {signatureItems.map((item) => (
            <motion.div key={item.name} variants={itemVariants}>
              <MenuCard item={item} variant="signature" className="h-full" />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom note */}
        <motion.p
          className="mt-10 text-center font-sans text-xs text-cream/25 tracking-wide"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Prices may vary. For the latest menu, visit us or order on Zomato.
        </motion.p>
      </div>
    </section>
  );
}
