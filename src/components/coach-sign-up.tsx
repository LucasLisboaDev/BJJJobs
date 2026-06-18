"use client";
import { useEffect } from "react";
import { SignUp } from "@clerk/nextjs";

const REDIRECTS: Record<string, string> = {
  coach: "/register/coach",
};

export default function CoachSignUp() {
  useEffect(() => {
    sessionStorage.setItem("bjjjobs_signup_role", "COACH");
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <SignUp
        forceRedirectUrl={REDIRECTS.coach}
        signInUrl="/login"
        unsafeMetadata={{ role: "COACH" }}
      />
    </div>
  );
}
