import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { LegacyMarquee } from "@/components/sections/LegacyMarquee";
import { SignatureItems } from "@/components/sections/SignatureItems";
import { AmbientGallery } from "@/components/sections/AmbientGallery";
import { OurStory } from "@/components/sections/OurStory";
import { VisitUs } from "@/components/sections/VisitUs";
import { Footer } from "@/components/sections/Footer";
import { cafe } from "@/content/cafe";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    name: cafe.name,
    description: cafe.description,
    url: "https://coffeesince1999.in",
    telephone: cafe.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: cafe.address.street,
      addressLocality: "Chennai",
      addressRegion: cafe.address.state,
      postalCode: cafe.address.zip,
      addressCountry: "IN",
    },
    openingHours: "Mo-Su 08:00-23:45",
    servesCuisine: ["Continental", "American", "North Indian"],
    priceRange: "₹₹",
    aggregateRating: { "@type": "AggregateRating", ratingValue: cafe.rating, reviewCount: "1505" },
    sameAs: [cafe.social.instagram],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main>
        <Hero />
        <LegacyMarquee />
        <SignatureItems />
        <AmbientGallery />
        <OurStory />
        <VisitUs />
      </main>
      <Footer />
    </>
  );
}
