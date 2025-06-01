/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure static files are properly handled
  reactStrictMode: true,
  // Configure output for better static file handling
  output: 'standalone',
  // Next.js 15 compatible options
  experimental: {}
}

module.exports = nextConfig
