import { images, site } from "@/lib/site";

export function restaurantJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Restaurant", "LocalBusiness"],
    "@id": `${site.url}/#restaurant`,
    name: site.legalName,
    url: site.url,
    image: [`${site.url}${images.hero}`, `${site.url}${images.og}`],
    description: site.description,
    telephone: site.phones.map((phone) => phone.label),
    address: {
      "@type": "PostalAddress",
      streetAddress: "просп. Кирова, 393В",
      addressLocality: "Самара",
      addressCountry: "RU"
    },
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
    hasMenu: `${site.url}/#menu`,
    sameAs: [site.telegram, site.instagram, site.yandexOrgUrl]
  };
}
