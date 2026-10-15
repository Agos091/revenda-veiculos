import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // fotos dos veículos no Supabase Storage
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
      // placeholders do seed de desenvolvimento
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

export default nextConfig;
