import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PGlite loads its own wasm/data assets via relative paths at runtime;
  // bundling it breaks that resolution, so keep it external to the server
  // bundle (both for Turbopack dev and the webpack production build).
  serverExternalPackages: ["@electric-sql/pglite"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
