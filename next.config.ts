import type { NextConfig } from "next";

// cacheComponents is disabled: the spec requires route segment `runtime = "nodejs"`
// on /api/order, which is incompatible with cacheComponents in Next 16.
const nextConfig: NextConfig = {
  cacheComponents: false,
  partialPrefetching: false,
  devIndicators: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default nextConfig;
