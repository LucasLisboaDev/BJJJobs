"use client";
import { useEffect } from "react";
import { SignUp } from "@clerk/nextjs";
import { Logo } from "@/components/ui/logo";

const SIGN_UP_PATH = "/register/coach/account";

export default function CoachSignUp() {
  useEffect(() => {
    sessionStorage.setItem("bjjjobs_signup_role", "COACH");
  }, []);

  return (
    <div className="min-h-screen bg-grouped">
      <div className="sticky top-0 z-50 px-4 py-3 bg-grouped-secondary/90 backdrop-blur-xl border-b border-separator/30">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Logo />
          <div className="text-caption-1 text-label-tertiary">Coach sign up</div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md mb-6 text-center">
          <h1 className="text-title-2 mb-1">Create your coach account</h1>
          <p className="text-subheadline text-label-secondary">
            Sign up with email or Google, then complete your BJJ profile.
          </p>
        </div>

        <SignUp
          path={SIGN_UP_PATH}
          routing="path"
          forceRedirectUrl="/register/coach"
          signInUrl="/login"
          unsafeMetadata={{ role: "COACH" }}
          appearance={{
            elements: {
              rootBox: "w-full max-w-md",
              card: "shadow-ios border-none rounded-ios-lg bg-grouped-secondary",
            },
          }}
        />
      </div>
    </div>
  );
}
