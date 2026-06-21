"use client";
import { useEffect } from "react";
import { SignUp } from "@clerk/nextjs";

const SIGN_UP_PATH = "/register/coach/account";

export default function CoachSignUp() {
  useEffect(() => {
    sessionStorage.setItem("bjjjobs_signup_role", "COACH");
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <SignUp
        path={SIGN_UP_PATH}
        routing="path"
        forceRedirectUrl="/register/coach"
        signInUrl="/login"
        unsafeMetadata={{ role: "COACH" }}
      />
    </div>
  );
}
