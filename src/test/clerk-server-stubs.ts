import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type ClerkMiddlewareHandler = (
  auth: () => { protect: () => void },
  req: NextRequest
) => void;

export function clerkMiddleware(handler: ClerkMiddlewareHandler) {
  return function middleware(req: NextRequest) {
    handler(
      () => ({
        protect: () => {},
      }),
      req
    );
    return NextResponse.next();
  };
}

export function createRouteMatcher(_patterns: string[]) {
  return (_req: NextRequest) => false;
}

export async function auth() {
  return { userId: null as string | null };
}

export const clerkClient = {
  users: {
    getUser: async () => null,
  },
};
