import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // next/image refuses to optimise images from hosts that are not
    // listed here. Without this, any remote cover image throws
    // "hostname is not configured under images".
    //
    // It is a safety feature, not red tape: it stops anyone pointing
    // our image optimiser at arbitrary URLs and running up the bill.
    remotePatterns: [
      // Placeholder covers used by supabase/seed.sql.
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },

      // Supabase Storage, where real uploads will be served from.
      // The wildcard covers any project reference.
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/**",
      },
    ],
  },
};

export default nextConfig;
