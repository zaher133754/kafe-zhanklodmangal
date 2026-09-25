import { AboutSection } from "@/components/AboutSection";
import { ContactsSection } from "@/components/ContactsSection";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MenuSection } from "@/components/MenuSection";
import { TrustSection } from "@/components/TrustSection";
import { restaurantJsonLd } from "@/lib/json-ld";

export const dynamic = "force-static";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <AboutSection />
        <MenuSection />
        <TrustSection />
        <ContactsSection />
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(restaurantJsonLd()).replace(/</g, "\\u003c")
        }}
      />
    </>
  );
}
