/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "utfs.io",
      },
      {
        hostname: "www.google.com",
      },
      {
        hostname: "freesvg.org",
      },
    ],
  },
}

export default nextConfig
