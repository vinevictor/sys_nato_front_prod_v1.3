/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Gera buildId estático para evitar problemas após deploy
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },

  // Headers para controlar cache
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
