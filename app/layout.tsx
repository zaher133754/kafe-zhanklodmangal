import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import "./globals.css";
import { YandexMetrika } from "@/components/analytics/YandexMetrika";
import { images, site } from "@/lib/site";
import appleTouchIcon from "@/public/apple-touch-icon.png";
import favicon from "@/public/favicon.ico";

const tildaSans = localFont({
  src: "../public/fonts/tildasans-vf.woff2",
  variable: "--font-tilda-sans",
  display: "swap",
  preload: true,
  weight: "250 1000",
  fallback: ["Arial", "sans-serif"]
});

const yandexMetrikaId = Number(
  process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID
);
const isYandexMetrikaEnabled =
  Number.isInteger(yandexMetrikaId) &&
  yandexMetrikaId > 0 &&
  (process.env.NODE_ENV === "production" ||
    process.env.NEXT_PUBLIC_YANDEX_METRIKA_DEBUG === "true");

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s | ${site.name}`
  },
  description: site.description,
  keywords: [...site.keywords],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
    images: [
      {
        url: images.og,
        width: 1024,
        height: 630,
        alt: site.title
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: [images.og]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  icons: {
    icon: {
      url: favicon.src,
      type: "image/x-icon",
      sizes: "32x32"
    },
    shortcut: {
      url: favicon.src,
      type: "image/x-icon"
    },
    apple: {
      url: appleTouchIcon.src,
      type: "image/png",
      sizes: "180x180"
    }
  },
  formatDetection: {
    telephone: false
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#070504",
  colorScheme: "dark"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${tildaSans.variable} dark`}>
      <body>
        {children}
        {isYandexMetrikaEnabled ? (
          <Suspense fallback={null}>
            <YandexMetrika counterId={yandexMetrikaId} />
          </Suspense>
        ) : null}
      </body>
    </html>
  );
}
