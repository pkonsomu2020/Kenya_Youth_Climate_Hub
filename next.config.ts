import type { NextConfig } from "next";
import path from "path";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },

  // Silence the "multiple lockfiles" workspace root warning
  turbopack: {
    root: path.resolve(__dirname),
  },

  // Security headers for production
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // afosi.org embeds KYCH, so framing is limited to it (this was a server-only edit before)
          { key: "Content-Security-Policy", value: "frame-ancestors 'self' https://afosi.org https://www.afosi.org http://localhost:*" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },

  // Allow images from Supabase storage and external news sources
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "vtlsykfqhbifwumfaisl.supabase.co" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "**.cloudinary.com" },
    ],
  },
};

export default withNextIntl(nextConfig);
