"use client";
import { useState } from "react";
import { SignUp } from "@clerk/nextjs";
import { Logo } from "@/components/ui/logo";

export default function GymSignUp() {
  const [gymName, setGymName] = useState("");

  return (
    <div className="min-h-screen bg-grouped">
      <div className="sticky top-0 z-50 px-4 py-3 bg-grouped-secondary/90 backdrop-blur-xl border-b border-separator/30">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Logo />
          <div className="text-caption-1 text-label-tertiary">Gym sign up</div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md mb-6 text-center">
          <h1 className="text-title-2 mb-1">Create your gym account</h1>
          <p className="text-subheadline text-label-secondary">
            Your name and email are for your login. The gym name is how coaches will find you.
          </p>
        </div>

        <div className="w-full max-w-md mb-4">
          <label className="field-label">
            Gym name <span className="text-red-500">*</span>
          </label>
          <input
            className="ios-field"
            placeholder="e.g. Alliance Miami"
            value={gymName}
            onChange={(e) => {
              setGymName(e.target.value);
              sessionStorage.setItem("bjjjobs_gym_name", e.target.value);
              sessionStorage.setItem("bjjjobs_signup_role", "GYM");
            }}
          />
        </div>

        {gymName.trim() ? (
          <SignUp
            path="/register/gym/account"
            routing="path"
            forceRedirectUrl="/register/gym"
            signInUrl="/login"
            unsafeMetadata={{ role: "GYM", gymName: gymName.trim() }}
            appearance={{
              elements: {
                rootBox: "w-full max-w-md",
                card: "shadow-ios border-none rounded-ios-lg bg-grouped-secondary",
              },
            }}
          />
        ) : (
          <div className="w-full max-w-md border-2 border-dashed border-separator/40 rounded-ios-lg p-8 text-center text-subheadline text-label-tertiary ios-card">
            Enter your gym name above to continue with your account details.
          </div>
        )}
      </div>
    </div>
  );
}
