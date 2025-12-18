/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // This tells Next.js to trust your phone's connection
    allowedDevOrigins: ['192.168.1.60']
  },
};

export default nextConfig;