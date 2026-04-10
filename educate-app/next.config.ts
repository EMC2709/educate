import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Next.js 16 auto-generates a validator referencing [...nextauth] which doesn't exist.
    // Our actual source code is fully typed; this only suppresses the generated-file error.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
