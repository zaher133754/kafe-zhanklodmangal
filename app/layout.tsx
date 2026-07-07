import type { Metadata, Viewport } from "next";
import "./globals.css";
import { images, site } from "@/lib/site";

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
      url: "/apple-touch-icon.png",
      type: "image/png"
    },
    shortcut: {
      url: "/apple-touch-icon.png",
      type: "image/png"
    },
    apple: "/apple-touch-icon.png"
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
    <html lang="ru" className="dark">
      <body>{children}</body>
    </html>
  );
}
