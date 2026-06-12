import { Share2, Phone, MapPin } from "lucide-react";
import { cafe } from "@/content/cafe";

export function Footer() {
  return (
    <footer className="bg-espresso border-t border-bark/20 px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div>
              <span className="font-display text-3xl font-semibold text-cream block leading-none">
                Coffee?
              </span>
              <span className="font-sans text-[10px] font-medium tracking-[0.3em] uppercase text-cream/30">
                Since 1999
              </span>
            </div>
            <p className="font-sans text-sm text-cream/40 leading-relaxed max-w-xs">
              Chennai&apos;s OG hangout. Open since 1999. A place that smells like coffee and feels
              like home.
            </p>
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-3 py-1 rounded-full bg-bark/20 border border-bark/30 font-sans text-[10px] text-cream/40 uppercase tracking-wider">
                Halal Certified
              </span>
              <span className="px-3 py-1 rounded-full bg-caramel/10 border border-caramel/20 font-sans text-[10px] text-caramel/60 uppercase tracking-wider">
                4.4★ on Google
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.25em] text-cream/30 mb-5">
              Explore
            </p>
            <div className="flex flex-col gap-3">
              {[
                ["Menu", "/menu"],
                ["Our Story", "/#story"],
                ["Visit Us", "/#visit"],
                ["Order on Zomato", cafe.zomato ?? "#"],
                ["Order on Swiggy", cafe.swiggy ?? "#"],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="font-sans text-sm text-cream/50 hover:text-cream transition-colors duration-200 w-fit"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.25em] text-cream/30 mb-5">
              Contact
            </p>
            <div className="flex flex-col gap-4">
              <a
                href={`tel:${cafe.phone}`}
                className="flex items-center gap-3 text-cream/50 hover:text-cream transition-colors group"
              >
                <Phone size={14} className="text-caramel/60 group-hover:text-caramel" />
                <span className="font-sans text-sm">{cafe.phone}</span>
              </a>
              <a
                href={cafe.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-cream/50 hover:text-cream transition-colors group"
              >
                <MapPin size={14} className="text-caramel/60 group-hover:text-caramel mt-0.5 shrink-0" />
                <span className="font-sans text-sm leading-relaxed">
                  {cafe.address.street},<br />
                  {cafe.address.city}
                </span>
              </a>
              {cafe.social.instagram && (
                <a
                  href={cafe.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-cream/50 hover:text-cream transition-colors group"
                >
                  <Share2 size={14} className="text-caramel/60 group-hover:text-caramel" />
                  <span className="font-sans text-sm">@coffeesince1999</span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-bark/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-cream/25">
            © {new Date().getFullYear()} Coffee? Since 1999. Thousand Lights, Chennai.
          </p>
          <p className="font-sans text-xs text-cream/20">
            Open daily 8:00 AM – 11:45 PM
          </p>
        </div>
      </div>
    </footer>
  );
}
