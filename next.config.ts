import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    path: process.env.NODE_ENV === 'production' ? "https://cloudflare-image.exonenterprise.workers.dev/" : undefined,
    remotePatterns: [
      {
        hostname: "utfs.io",
      },
      {
        hostname: "picsum.photos",
      },
      {
        hostname: "utfs.io",
      },
      {
        hostname: "images.unsplash.com",
      },
      {
        hostname: "ian90so1p2.ufs.sh",
      },
      {
        hostname: "cdn.image.engineering",
      }
    ],
  },
};

export default nextConfig;
