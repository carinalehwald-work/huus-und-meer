import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Nur das Requestvolumen; die fachlichen Dateilimits bleiben in submitApplication.
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
