import { restaurantJsonLd } from "@/lib/json-ld";
import { site } from "@/lib/site";

export const banquetSeoTitle =
  "Банкеты и корпоративы в Самаре | Жан Клод Мангал";
export const banquetSeoDescription =
  "Банкеты, корпоративы и дни рождения в Самаре до 40 человек. От 2500 ₽ на гостя, можно со своим алкоголем. Забронируйте дату по телефону.";
export const banquetPageUrl = `${site.url}/banquets`;

export function banquetPageJsonLd() {
  const restaurant = {
    ...restaurantJsonLd(),
    "@context": undefined
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      restaurant,
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        inLanguage: "ru-RU"
      },
      {
        "@type": "WebPage",
        "@id": `${banquetPageUrl}/#webpage`,
        url: banquetPageUrl,
        name: banquetSeoTitle,
        description: banquetSeoDescription,
        inLanguage: "ru-RU",
        isPartOf: { "@id": `${site.url}/#website` },
        mainEntity: { "@id": `${banquetPageUrl}/#service` },
        breadcrumb: { "@id": `${banquetPageUrl}/#breadcrumb` }
      },
      {
        "@type": "Service",
        "@id": `${banquetPageUrl}/#service`,
        name: "Банкеты, корпоративы и дни рождения в Самаре",
        serviceType: "Организация банкетов и мероприятий",
        url: banquetPageUrl,
        description: banquetSeoDescription,
        image: [
          `${site.url}/images/banquet-table.webp`,
          `${site.url}/images/banquet-hall.webp`,
          `${site.url}/images/banquet-food.webp`
        ],
        provider: { "@id": `${site.url}/#restaurant` },
        areaServed: {
          "@type": "City",
          name: "Самара"
        },
        offers: {
          "@type": "Offer",
          url: banquetPageUrl,
          price: "2500",
          priceCurrency: "RUB",
          availability: "https://schema.org/InStock",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "2500",
            priceCurrency: "RUB",
            unitText: "за гостя"
          }
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${banquetPageUrl}/#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Главная",
            item: `${site.url}/`
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Банкеты",
            item: banquetPageUrl
          }
        ]
      }
    ]
  };
}
