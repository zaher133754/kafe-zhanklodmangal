import { Clock3, MapPin, Phone } from "lucide-react";
import { yandexTrust } from "@/data/reviews";
import { site } from "@/lib/site";

export function BanquetContacts() {
  return (
    <section
      className="section-surface relative bg-charcoal lg:min-h-[600px]"
      data-banquet-contacts
    >
      <div className="container-tilda relative z-10 py-14 lg:pointer-events-none lg:absolute lg:inset-x-0 lg:top-1/2 lg:-translate-y-1/2 lg:py-0">
        <div className="premium-panel w-full p-6 sm:p-8 lg:pointer-events-auto lg:max-w-[430px]">
          <h2 className="text-balance text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-[1.08] tracking-[-0.025em] text-cream">
            Контакты
          </h2>

          <div className="mt-8 grid gap-6">
            <div className="grid grid-cols-[30px_1fr] gap-3">
              <MapPin className="mt-0.5 h-6 w-6 text-flame" strokeWidth={1.8} aria-hidden />
              <div>
                <p className="text-sm font-bold text-smoke">Адрес</p>
                <p className="mt-1 font-bold leading-relaxed text-cream">
                  {site.address}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-[30px_1fr] gap-3">
              <Phone className="mt-0.5 h-6 w-6 text-flame" strokeWidth={1.8} aria-hidden />
              <div>
                <p className="text-sm font-bold text-smoke">Телефон</p>
                <a
                  href={site.orderPhone.href}
                  className="orange-link focus-ring mt-1 inline-flex min-h-11 items-center text-xl font-extrabold"
                >
                  {site.orderPhone.label}
                </a>
              </div>
            </div>

            <div className="grid grid-cols-[30px_1fr] gap-3">
              <Clock3 className="mt-0.5 h-6 w-6 text-flame" strokeWidth={1.8} aria-hidden />
              <div>
                <p className="text-sm font-bold text-smoke">Время работы</p>
                <ul className="mt-1 grid gap-1 font-bold leading-relaxed text-cream">
                  {site.openingHours.map((hours) => (
                    <li key={hours}>{hours}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <a
            href={yandexTrust.routeUrl}
            target="_blank"
            rel="noreferrer"
            className="cta-pill focus-ring mt-8 w-full"
          >
            Построить маршрут
          </a>
        </div>
      </div>

      <iframe
        title="ЖанКлод Мангал на Яндекс Картах"
        src={yandexTrust.banquetMapEmbedUrl}
        className="block h-[460px] w-full border-0 lg:h-[600px]"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
    </section>
  );
}
