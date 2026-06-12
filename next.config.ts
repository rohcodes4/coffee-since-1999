import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "houseofstarss.com" },
      { protocol: "https", hostname: "media.gettyimages.com" },
    ],
  },
};

export default nextConfig;
