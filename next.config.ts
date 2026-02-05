/** @type {import('next').NextConfig} */
const nextConfig = {
  // Empty turbopack config to silence the warning
  turbopack: {},

  // Ensure public files are served correctly
  async headers() {
    return [
      {
        source: '/pdf.worker.min.mjs',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
