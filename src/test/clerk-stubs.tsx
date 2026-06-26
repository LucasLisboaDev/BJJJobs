"use client";

import type { ReactNode } from "react";

export function ClerkProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function SignedIn({ children }: { children: ReactNode }) {
  return null;
}

export function SignedOut({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function UserButton() {
  return null;
}

export function SignIn() {
  return null;
}

export function SignUp() {
  return null;
}

export function SignOutButton({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useAuth() {
  return { isLoaded: true, isSignedIn: false, userId: null as string | null };
}

export function useUser() {
  return { isLoaded: true, isSignedIn: false, user: null };
}
