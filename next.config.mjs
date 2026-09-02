/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Static export can't run the image optimization API server-side.
    // We pre-optimize photos at build time via the gift-giver's image pipeline.
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Add remote photo hosts here if /photos/foo.jpg uses HTTPS URLs.
      // Example: { protocol: 'https', hostname: 'images.unsplash.com' }
    ],
  },
  // Trailing slash makes the static export friendly to static hosts (Vercel, Netlify, Pages).
  trailingSlash: true,
};

export default nextConfig;
