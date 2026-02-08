import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",      // <--- CRITICAL: Tells Next.js to build to the 'out' folder
  images: {
    unoptimized: true,   // <--- CRITICAL: Prevents image errors on Cloudflare
  },
};

export default nextConfig;
