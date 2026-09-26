import { Phone } from "lucide-react";
import { BanquetPhoneLink } from "@/components/banquets/BanquetPhoneLink";

export function BanquetPhoneCta() {
  return (
    <section className="section-surface bg-espresso px-[18px] py-20 text-center sm:py-24">
      <div className="mx-auto max-w-4xl">
        <Phone
          className="mx-auto h-9 w-9 text-flame"
          strokeWidth={1.7}
          aria-hidden
        />
        <h2 className="mt-5 text-balance text-[clamp(1.8rem,4vw,3.25rem)] font-extrabold leading-[1.13] tracking-[-0.025em] text-cream">
          Узнать цену на банкет по телефону
        </h2>
        <BanquetPhoneLink />
      </div>
    </section>
  );
}
