import Image from "next/image";
import { images, site } from "@/lib/site";

export function ContactsSection() {
  return (
    <section
      id="contacts"
      className="section-surface cv-auto bg-espresso py-[88px] md:py-[132px]"
    >
      <div className="container-tilda text-center">
        <div className="premium-panel mx-auto max-w-[1080px] px-5 py-12 sm:px-10 sm:py-14 md:px-14 md:py-16">
          <h2
            className="text-balance text-[clamp(30px,4vw,52px)] font-extrabold leading-[1.13] tracking-[-0.025em] text-cream"
            data-reveal
          >
            Контакты
            <br />
            Телефон:
            <br />
            {site.phones.map((phone) => (
              <a
                className="orange-link focus-ring block"
                href={phone.href}
                key={phone.href}
              >
                {phone.label}
              </a>
            ))}
            Адрес:{" "}
            <a
              className="orange-link focus-ring"
              href={site.yandexMapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              {site.address}
            </a>
          </h2>

          <div
            className="mx-auto mt-10 max-w-[900px] rounded-2xl border border-gold/15 bg-charcoal/45 px-5 py-6 text-[15px] font-normal leading-[1.65] text-cream/78 sm:px-7 md:text-[19px]"
            data-reveal
            data-reveal-delay="90"
          >
            <strong className="font-bold text-gold-soft">Как мы доставляем</strong>
            <br />
            <em>До 3 км:</em> при заказе от 2500 руб — бесплатно, до 2500 руб —
            250 руб.
            <br />
            <em>От 3 км:</em> 350 руб (или бесплатно от 3000 руб).
          </div>

          <div
            className="mt-8 flex justify-center gap-4"
            role="group"
            aria-label="Социальные сети"
            data-reveal
            data-reveal-delay="160"
          >
            <a
              className="focus-ring relative h-10 w-10 overflow-hidden rounded-full ring-1 ring-gold/20 shadow-[0_8px_24px_rgba(0,0,0,0.28)] transition-[transform,box-shadow] hover:scale-105 hover:shadow-[0_12px_30px_rgba(255,85,0,0.16)]"
              href={site.telegram}
              target="_blank"
              rel="nofollow noreferrer"
              aria-label="Telegram"
            >
              <Image
                src={images.social.telegram}
                alt=""
                fill
                sizes="32px"
                className="object-contain"
              />
            </a>
            <a
              className="focus-ring relative h-10 w-10 overflow-hidden rounded-[10px] ring-1 ring-gold/20 shadow-[0_8px_24px_rgba(0,0,0,0.28)] transition-[transform,box-shadow] hover:scale-105 hover:shadow-[0_12px_30px_rgba(255,85,0,0.16)]"
              href={site.instagram}
              target="_blank"
              rel="nofollow noreferrer"
              aria-label="Instagram"
            >
              <Image
                src={images.social.instagram}
                alt=""
                fill
                sizes="32px"
                className="object-contain"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
