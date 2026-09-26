import type { Metadata } from "next";
import { BanquetHero } from "@/components/banquets/BanquetHero";
import { BanquetRequestDialog } from "@/components/banquets/BanquetRequestDialog";
import { BanquetPhoneCta } from "@/components/banquets/BanquetPhoneCta";
import { BanquetReviews } from "@/components/banquets/BanquetReviews";
import { BanquetContacts } from "@/components/banquets/BanquetContacts";
import { Header } from "@/components/Header";
import banquetTable from "@/public/images/banquet-table.webp";

export const dynamic = "force-static";

const title =
  "Банкеты, корпоративы и Дни рождения в Самаре";
const description =
  "Банкеты и корпоративы в Самаре до 40 человек. Стоимость от 2500 ₽ на гостя, можно со своим алкоголем. Тёплая атмосфера и блюда с мангала.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/banquets"
  },
  openGraph: {
    type: "website",
    url: "/banquets",
    title,
    description,
    images: [
      {
        url: banquetTable.src,
        width: banquetTable.width,
        height: banquetTable.height,
        alt: "Банкетный стол с блюдами ЖанКлод Мангал"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [banquetTable.src]
  },
  robots: {
    index: true,
    follow: true
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
    </>
  );
}
