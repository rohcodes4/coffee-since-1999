import { Share2, Phone, MapPin } from "lucide-react";
import { cafe } from "@/content/cafe";

export function Footer() {
  return (
    <footer className="bg-ink px-6 lg:px-10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-paper/10">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div>
              <span
                className="font-display font-semibold text-paper block leading-none"
                style={{ fontSize: "2.2rem", fontVariationSettings: '"opsz" 40' }}
              >
                Coffee?
              </span>
              <span className="font-sans text-[9px] font-medium tracking-[0.35em] uppercase text-paper/30">
                Since 1999
              </span>
            </div>
            <p className="font-sans text-xs text-paper/40 leading-relaxed max-w-xs">
              Chennai&apos;s OG hangout. Open since 1999. A place that smells like coffee and feels
              like home.
            </p>
            <div className="flex flex-wrap gap-2 mt-1">
              <span className="px-3 py-1 rounded-full border border-paper/10 font-sans text-[10px] text-paper/30 uppercase tracking-wider">
                Chennai&apos;s OG Cafe
              </span>
              <span className="px-3 py-1 rounded-full border border-caramel/20 font-sans text-[10px] text-caramel/60 uppercase tracking-wider">
                4.4 ★ Google
              </span>
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-paper/25 mb-5">Explore</p>
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
                  className="font-sans text-sm text-paper/40 hover:text-paper transition-colors w-fit"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-paper/25 mb-5">Contact</p>
            <div className="flex flex-col gap-4">
              <a href={`tel:${cafe.phone}`} className="flex items-center gap-3 text-paper/40 hover:text-paper transition-colors group">
                <Phone size={13} className="text-caramel/50 group-hover:text-caramel" />
                <span className="font-sans text-sm">{cafe.phone}</span>
              </a>
              <a href={cafe.mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-paper/40 hover:text-paper transition-colors group">
                <MapPin size={13} className="text-caramel/50 group-hover:text-caramel mt-0.5 shrink-0" />
                <span className="font-sans text-sm leading-relaxed">
                  {cafe.address.street},<br />{cafe.address.city}
                </span>
              </a>
              {cafe.social.instagram && (
                <a href={cafe.social.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-paper/40 hover:text-paper transition-colors group">
                  <Share2 size={13} className="text-caramel/50 group-hover:text-caramel" />
                  <span className="font-sans text-sm">@coffeesince1999</span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-[11px] text-paper/20">
            © {new Date().getFullYear()} Coffee? Since 1999 · Thousand Lights, Chennai
          </p>
          <p className="font-sans text-[11px] text-paper/20">Open daily 8:00 AM – 11:45 PM</p>
        </div>
      </div>
    </footer>
  );
}
