/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  redirects: async () => [
    {
      source: "/",
      destination: "/notes",
      permanent: false,
    },
  ],
};

module.exports = nextConfig;
