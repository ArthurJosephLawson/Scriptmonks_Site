import type { NextConfig } from "next";

// cacheComponents is disabled: the spec requires route segment `runtime = "nodejs"`
// on /api/order, which is incompatible with cacheComponents in Next 16.
const nextConfig: NextConfig = {
  cacheComponents: false,
  partialPrefetching: false,
  devIndicators: false,
  // Next 16 blocks dev-only endpoints (HMR WebSocket, flight prefetch) for
  // origins other than `localhost`. Without this, a dev server reached at
  // 127.0.0.1 silently stalls hydration.
  allowedDevOrigins: ["127.0.0.1"],
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
