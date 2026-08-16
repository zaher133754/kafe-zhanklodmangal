import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { PolicyDocumentContent } from "@/content/legal/policy";

const title = "Политика в отношении обработки персональных данных";
const description =
  "Порядок обработки и защиты персональных данных посетителей и покупателей сайта кафе «Жан Клод Мангал».";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/policy"
  }
};

export default function PolicyPage() {
  return (
    <LegalPageLayout title={title} description={description}>
      <PolicyDocumentContent />
    </LegalPageLayout>
  );
}
