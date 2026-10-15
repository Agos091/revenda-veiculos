import type { NextConfig } from "next";

/** Cabeçalhos de segurança aplicados a todas as páginas. */
const headersDeSeguranca = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(self), microphone=(), geolocation=(), payment=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // fotos dos veículos no Supabase Storage
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // placeholders do seed e do modo demo
      { protocol: "https", hostname: "picsum.photos" },
    ],
    formats: ["image/avif", "image/webp"],
    // as fotos não mudam depois de publicadas
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  poweredByHeader: false,
  compress: true,
  async headers() {
    return [{ source: "/:path*", headers: headersDeSeguranca }];
  },
};

export default nextConfig;
