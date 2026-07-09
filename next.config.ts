import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 768, 1024, 1280, 1440, 1920],
    imageSizes: [96, 160, 240, 320, 360, 480, 720],
    qualities: [75, 82, 88],
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
