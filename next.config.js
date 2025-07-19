/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'lastfm.freetls.fastly.net',   // Untuk gambar dari Last.fm
      'photos.bandsintown.com',     // <--- TAMBAHKAN INI UNTUK GAMBAR BANDSINTOWN
    ],
  },
}

module.exports = nextConfig