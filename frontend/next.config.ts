import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "teslamag.de",
      "mediapool.bmwgroup.com",
      "ste-foytoyota.com",
      "ford.com",
      "mkt-vehicleimages-prd.autotradercdn.ca",
      "di-uploads-pod1.dealerinspire.com",
      "p.turbosquid.com",
      "images.hgmsites.net",
      "res.cloudinary.com",
    ],
  },
};

export default nextConfig;
