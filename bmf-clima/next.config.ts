import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  
  env: {
    API_TOKEN: `${process.env.API_TOKEN}`,
    API_URL: `${process.env.API_URL}`,
    HOST_URL: `${process.env.HOST_URL}`,
  },
};

export default nextConfig;
