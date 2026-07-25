import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async headers() {
    return [
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=2592000, stale-while-revalidate=31536000"
          }
        ]
      },
      {
        source: "/menu/:path*",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=2592000, stale-while-revalidate=31536000"
          }
        ]
      },
      {
        source: "/_next/image",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800"
          }
        ]
      },
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400"
          }
        ]
      }
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 768, 1024, 1280, 1440, 1920],
    imageSizes: [96, 160, 240, 320, 360, 480, 720],
    qualities: [55, 60, 70, 75, 78, 82, 88],
    localPatterns: [
      {
        pathname: "/images/**",
        search: ""
      },
      {
        pathname: "/apple-touch-icon.png",
        search: ""
      },
      {
        pathname: "/menu/**",
        search: ""
      },
      {
        pathname: "/menu/**",
        search: "?v=20260708-030526"
      },
      {
        pathname: "/menu/**",
        search: "?v=20260708-030534"
      }
    ],
    minimumCacheTTL: 31536000
  }
};

export default nextConfig;
