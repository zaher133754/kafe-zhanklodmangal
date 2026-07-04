import { AboutSection } from "@/components/AboutSection";
import { BanquetsSection } from "@/components/BanquetsSection";
import { ContactsSection } from "@/components/ContactsSection";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MenuSection } from "@/components/MenuSection";
import { RevealObserver } from "@/components/RevealObserver";
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
        <BanquetsSection />
        <ContactsSection />
      </main>
      <RevealObserver />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(restaurantJsonLd()).replace(/</g, "\\u003c")
        }}
      />
    </>
  );
}
