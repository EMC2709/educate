import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Keep native/WASM PDF deps out of the bundle — used only in server routes
  serverExternalPackages: ['@napi-rs/canvas', 'pdfjs-dist'],
  // pdfjs loads its worker by a runtime-resolved path, which file tracing can't see,
  // so ship it explicitly with the routes that render PDF pages.
  outputFileTracingIncludes: {
    '/api/paper-page': ['./node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs'],
    '/api/paper-pagecount': ['./node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs'],
    '/api/mark-scheme': ['./node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs'],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-DNS-Prefetch-Control", value: "off" },
        ],
      },
      {
        // The paper page embeds this route in a same-origin iframe (PDF Figures panel).
        // Listed after the catch-all so it overrides X-Frame-Options: DENY for this path only.
        source: "/api/paper-pdf",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
        ],
      },
      {
        // The answers view shows the official mark scheme beside the student's answers
        source: "/api/mark-scheme",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
        ],
      },
    ];
  },
};

export default nextConfig;
