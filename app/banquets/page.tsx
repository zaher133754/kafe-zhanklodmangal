import type { Metadata } from "next";
import { BanquetHero } from "@/components/banquets/BanquetHero";
import { BanquetRequestDialog } from "@/components/banquets/BanquetRequestDialog";
import { BanquetPhoneCta } from "@/components/banquets/BanquetPhoneCta";
import { BanquetReviews } from "@/components/banquets/BanquetReviews";
import { BanquetContacts } from "@/components/banquets/BanquetContacts";
import { Header } from "@/components/Header";
import banquetTable from "@/public/images/banquet-table.webp";
import {
  banquetPageJsonLd,
  banquetPageUrl,
  banquetSeoDescription,
  banquetSeoTitle
} from "@/lib/banquet-json-ld";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: {
    absolute: banquetSeoTitle
  },
  description: banquetSeoDescription,
  alternates: {
    canonical: banquetPageUrl
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: site.name,
    url: banquetPageUrl,
    title: banquetSeoTitle,
    description: banquetSeoDescription,
    images: [
      {
        url: banquetTable.src,
        width: banquetTable.width,
        height: banquetTable.height,
        alt: "Банкетный стол с блюдами Жан Клод Мангал"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: banquetSeoTitle,
    description: banquetSeoDescription,
    images: [banquetTable.src]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  }
};

export default function BanquetsPage() {
  return (
    <>
      <Header />
      <main>
        <BanquetHero />
        <BanquetPhoneCta />
        <BanquetReviews />
        <BanquetContacts />
      </main>
      <BanquetRequestDialog />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(banquetPageJsonLd()).replace(/</g, "\\u003c")
        }}
      />
    </>
  );
}
