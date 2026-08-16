import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { ConsentDocumentContent } from "@/content/legal/consent";

const title = "Согласие на обработку персональных данных";
const description =
  "Условия согласия на обработку персональных данных при оформлении заказа на сайте кафе «Жан Клод Мангал».";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/consent"
  }
};

export default function ConsentPage() {
  return (
    <LegalPageLayout title={title} description={description}>
      <ConsentDocumentContent />
    </LegalPageLayout>
  );
}
