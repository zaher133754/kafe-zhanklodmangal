import Image from "next/image";
import { images, site } from "@/lib/site";

export function ContactsSection() {
  return (
    <section
      id="contacts"
      className="cv-auto bg-espresso py-[120px] md:py-[135px]"
    >
      <div className="container-tilda text-center">
        <div className="mx-auto max-w-[1000px]" data-reveal>
          <h2 className="text-[30px] font-bold leading-[1.22] text-white md:text-[52px]">
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

          <div className="mx-auto mt-[45px] max-w-[950px] text-[14px] font-light leading-[1.55] text-white md:text-[20px]">
            <strong className="font-bold">Как мы доставляем</strong>
            <br />
            <em>До 3 км:</em> при заказе от 2500 руб — бесплатно, до 2500 руб —
            250 руб.
            <br />
            <em>От 3 км:</em> 350 руб (или бесплатно от 3000 руб).
          </div>

          <div
            className="mt-[30px] flex justify-center gap-3"
            role="group"
            aria-label="Социальные сети"
          >
            <a
              className="focus-ring relative h-8 w-8 overflow-hidden rounded-full transition-transform hover:scale-105"
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
              className="focus-ring relative h-8 w-8 overflow-hidden rounded-[8px] transition-transform hover:scale-105"
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
