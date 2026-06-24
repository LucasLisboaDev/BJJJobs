/** @type {import('next').NextConfig} */
const nextConfig = {
  // E2E runs a second dev server on :3001; separate dist avoids corrupting `.next`.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};
export default nextConfig;
