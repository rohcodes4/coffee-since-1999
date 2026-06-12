"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Clock, ExternalLink } from "lucide-react";
import { cafe } from "@/content/cafe";

export function VisitUs() {
  const todayName = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][new Date().getDay()];

  return (
    <section id="visit" className="bg-cream py-24 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <span className="font-sans text-[10px] font-semibold tracking-[0.35em] uppercase text-caramel block mb-3">
            Find Us
          </span>
          <h2
            className="font-display font-light text-ink leading-[0.9]"
            style={{ fontSize: "clamp(3rem, 8vw, 6rem)", fontVariationSettings: '"opsz" 100' }}
          >
            Come <em className="italic text-caramel" style={{ fontVariationSettings: '"opsz" 100, "SOFT" 40' }}>visit.</em>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          {/* Info */}
          <motion.div
            className="flex flex-col gap-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Address */}
            <div className="flex gap-4">
              <div className="w-9 h-9 rounded-xl border border-line bg-paper-2 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin size={15} className="text-caramel" />
              </div>
              <div>
                <p className="font-sans text-[10px] text-ink-3 uppercase tracking-wider mb-1">Address</p>
                <p className="font-sans text-sm text-ink leading-relaxed">
                  {cafe.address.street}<br />
                  {cafe.address.city}, {cafe.address.state} {cafe.address.zip}
                </p>
                <a
                  href={cafe.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-1.5 font-sans text-xs text-caramel hover:text-caramel-hover transition-colors"
                >
                  Get directions <ExternalLink size={10} />
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-4">
              <div className="w-9 h-9 rounded-xl border border-line bg-paper-2 flex items-center justify-center shrink-0">
                <Phone size={15} className="text-caramel" />
              </div>
              <div>
                <p className="font-sans text-[10px] text-ink-3 uppercase tracking-wider mb-1">Phone</p>
                <a href={`tel:${cafe.phone}`} className="font-sans text-sm text-ink hover:text-caramel transition-colors">
                  {cafe.phone}
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="flex gap-4">
              <div className="w-9 h-9 rounded-xl border border-line bg-paper-2 flex items-center justify-center shrink-0 mt-0.5">
                <Clock size={15} className="text-caramel" />
              </div>
              <div className="flex-1">
                <p className="font-sans text-[10px] text-ink-3 uppercase tracking-wider mb-3">Hours</p>
                <div className="flex flex-col gap-2">
                  {cafe.hours.map((h) => (
                    <div
                      key={h.day}
                      className={`flex items-center justify-between text-sm font-sans ${
                        h.day === todayName ? "text-caramel font-medium" : "text-ink-2"
                      }`}
                    >
                      <span>
                        {h.day}
                        {h.day === todayName && (
                          <span className="ml-2 text-[9px] bg-caramel/15 text-caramel px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                            Today
                          </span>
                        )}
                      </span>
                      <span>{h.closed ? "Closed" : `${h.open} – ${h.close}`}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-line">
              <motion.a
                href={cafe.zomato}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#E23744]/30 bg-[#E23744]/8 text-[#C42030] font-sans text-xs font-semibold hover:bg-[#E23744]/15 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Order on Zomato
              </motion.a>
              <motion.a
                href={cafe.swiggy}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#FC8019]/30 bg-[#FC8019]/8 text-[#E07010] font-sans text-xs font-semibold hover:bg-[#FC8019]/15 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Order on Swiggy
              </motion.a>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            className="rounded-2xl overflow-hidden border border-line min-h-[380px]"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1 }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.628348948752!2d80.25397647454928!3d13.066755187258124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5267f9399f2b31%3A0x68fb3dfcabc91c1b!2sCoffee%3F%20Since%201999!5e0!3m2!1sen!2sin!4v1718000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "380px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Coffee? Since 1999 on Google Maps"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
