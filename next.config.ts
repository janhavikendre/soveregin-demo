import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project. Without it, Next can infer the
  // wrong root when a stray lockfile exists higher up the tree (and on Vercel).
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
