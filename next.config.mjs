import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function isClerkE2eBypassEnabled() {
  return (
    process.env.CLERK_E2E_BYPASS === "1" ||
    process.env.NEXT_PUBLIC_CLERK_E2E_BYPASS === "1" ||
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY === "pk_test_ci_placeholder" ||
    process.env.CLERK_SECRET_KEY === "sk_test_ci_placeholder"
  );
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // E2E runs a second dev server on :3001; separate dist avoids corrupting `.next`.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  webpack: (config) => {
    if (isClerkE2eBypassEnabled()) {
      // Client-only stub; middleware bypasses Clerk separately (edge bundle ignores aliases).
      config.resolve.alias["@clerk/nextjs$"] = path.join(__dirname, "src/test/clerk-stubs.tsx");
    }
    return config;
  },
};

export default nextConfig;
