import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const clerkE2eBypass =
  process.env.CLERK_E2E_BYPASS === "1" ||
  process.env.NEXT_PUBLIC_CLERK_E2E_BYPASS === "1" ||
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY === "pk_test_ci_placeholder" ||
  process.env.CLERK_SECRET_KEY === "sk_test_ci_placeholder";

function bypassMiddleware(_req: NextRequest) {
  return NextResponse.next();
}

function productionMiddleware() {
  const { clerkMiddleware, createRouteMatcher } = require("@clerk/nextjs/server");
  const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/post-job(.*)"]);
  return clerkMiddleware((auth: () => { protect: () => void }, req: NextRequest) => {
    if (isProtectedRoute(req)) auth().protect();
  });
}

export default clerkE2eBypass ? bypassMiddleware : productionMiddleware();

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"],
};
