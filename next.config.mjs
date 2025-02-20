/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MERCADOPAGO_ACCESS_TOKEN: process.env.MERCADOPAGO_ACCESS_TOKEN,
  },
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
