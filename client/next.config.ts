import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" }
    ]
  },
  devIndicators: {
    buildActivity: false,
    buildActivityPosition: 'bottom-right',
  }
};

export default nextConfig;
