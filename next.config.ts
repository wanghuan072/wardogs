import type { NextConfig } from "next";

const developmentDirectives = process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";
const developmentConnections = process.env.NODE_ENV === "development" ? " ws:" : "";
const analyticsAndAdScripts = "https://www.googletagmanager.com https://pl31790058.profitableratecpmnetwork.com https://pl31790059.profitableratecpmnetwork.com https://www.highrevenueformat.com";
const analyticsAndAdConnections = "https://www.google-analytics.com https://region1.google-analytics.com https://pl31790058.profitableratecpmnetwork.com https://pl31790059.profitableratecpmnetwork.com https://www.highrevenueformat.com";
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${analyticsAndAdScripts}${developmentDirectives}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' ${analyticsAndAdConnections}${developmentConnections}`,
  "frame-src 'self' https:",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    qualities: [45, 55, 65, 75],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Strict-Transport-Security", value: "max-age=63072000" },
        ],
      },
    ];
  },
};

export default nextConfig;
