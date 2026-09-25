import type { Metadata } from "next";
import { BanquetsSection } from "@/components/BanquetsSection";
import { Header } from "@/components/Header";
import banquetTable from "@/public/images/banquet-table.webp";

export const dynamic = "force-static";

const title = "Банкеты и торжества";
const description =
  "Мы знаем, как сделать ваш праздник вкусным и уютным. Дни рождения, корпоративы или встречи с друзьями — в «ЖанКлод Мангал» вы получаете тёплую атмосферу, сочное мясо на углях и никакой суеты.";

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
        <BanquetsSection />
      </main>
    </>
  );
}
