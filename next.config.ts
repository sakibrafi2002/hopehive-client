import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    // Linting is not part of this project's build; type errors still fail the build.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
