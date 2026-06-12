"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Clock, ExternalLink } from "lucide-react";
import { cafe } from "@/content/cafe";

export function VisitUs() {
  const todayIndex = new Date().getDay();
  const orderedDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const todayName = orderedDays[todayIndex];

  return (
    <section id="visit" className="bg-roast py-28 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-sans text-xs font-medium tracking-[0.3em] uppercase text-caramel/70 mb-4">
            Find Us
          </p>
          <h2 className="font-display font-light text-[clamp(2.5rem,6vw,5rem)] leading-[1] text-cream">
            Come <span className="italic text-caramel">visit.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: info */}
          <motion.div
            className="flex flex-col gap-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65 }}
          >
            {/* Address */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-caramel/10 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin size={16} className="text-caramel" />
              </div>
              <div>
                <p className="font-sans text-xs text-cream/40 uppercase tracking-wider mb-1">
                  Address
                </p>
                <p className="font-sans text-base text-cream/80 leading-relaxed">
                  {cafe.address.street}
                  <br />
                  {cafe.address.city}, {cafe.address.state} {cafe.address.zip}
                </p>
                <a
                  href={cafe.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-2 font-sans text-xs text-caramel hover:text-caramel-light transition-colors"
                >
                  Get directions <ExternalLink size={11} />
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-caramel/10 flex items-center justify-center shrink-0">
                <Phone size={16} className="text-caramel" />
              </div>
              <div>
                <p className="font-sans text-xs text-cream/40 uppercase tracking-wider mb-1">
                  Phone
                </p>
                <a
                  href={`tel:${cafe.phone}`}
                  className="font-sans text-base text-cream/80 hover:text-cream transition-colors"
                >
                  {cafe.phone}
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-caramel/10 flex items-center justify-center shrink-0 mt-0.5">
                <Clock size={16} className="text-caramel" />
              </div>
              <div className="flex-1">
                <p className="font-sans text-xs text-cream/40 uppercase tracking-wider mb-3">
                  Hours
                </p>
                <div className="flex flex-col gap-2">
                  {cafe.hours.map((h) => (
                    <div
                      key={h.day}
                      className={`flex items-center justify-between ${
                        h.day === todayName ? "text-caramel" : "text-cream/50"
                      }`}
                    >
                      <span className="font-sans text-sm font-medium">
                        {h.day}
                        {h.day === todayName && (
                          <span className="ml-2 text-[10px] bg-caramel/20 text-caramel px-2 py-0.5 rounded-full font-medium">
                            Today
                          </span>
                        )}
                      </span>
                      <span className="font-sans text-sm">
                        {h.closed ? "Closed" : `${h.open} – ${h.close}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Delivery CTAs */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-bark/20">
              <motion.a
                href={cafe.zomato}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#E23744]/15 text-[#ff6b6b] border border-[#E23744]/25 font-sans text-sm font-medium hover:bg-[#E23744]/25 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Order on Zomato
              </motion.a>
              <motion.a
                href={cafe.swiggy}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#FC8019]/15 text-[#FC8019] border border-[#FC8019]/25 font-sans text-sm font-medium hover:bg-[#FC8019]/25 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Order on Swiggy
              </motion.a>
            </div>
          </motion.div>

          {/* Right: map */}
          <motion.div
            className="rounded-2xl overflow-hidden border border-bark/20 bg-roast min-h-[400px]"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, delay: 0.1 }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.628348948752!2d80.25397647454928!3d13.066755187258124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5267f9399f2b31%3A0x68fb3dfcabc91c1b!2sCoffee%3F%20Since%201999!5e0!3m2!1sen!2sin!4v1718000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "400px", filter: "invert(90%) hue-rotate(180deg)" }}
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
