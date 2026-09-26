import { images, site } from "@/lib/site";

export function restaurantJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Restaurant", "LocalBusiness"],
    "@id": `${site.url}/#restaurant`,
    name: "Жан Клод Мангал",
    legalName: site.legalName,
    url: site.url,
    image: [`${site.url}${images.hero}`, `${site.url}${images.og}`],
    description: site.description,
    telephone: site.orderPhone.label,
    address: {
      "@type": "PostalAddress",
      streetAddress: "просп. Кирова, 393В",
      addressLocality: "Самара",
      addressCountry: "RU"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 53.250859,
      longitude: 50.224685
    },
    hasMap: site.yandexOrgUrl,
    acceptsReservations: true,
    areaServed: {
      "@type": "City",
      name: "Самара"
    },
    servesCuisine: ["Шашлык", "Шаурма", "Бургеры", "Армянская кухня", "Гриль"],
    priceRange: "₽₽",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "11:00",
        closes: "23:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Friday", "Saturday"],
        opens: "11:00",
        closes: "23:59"
      }
    ],
    hasMenu: `${site.url}/menu`,
    sameAs: [site.telegram, site.instagram, site.yandexOrgUrl]
  };
}
