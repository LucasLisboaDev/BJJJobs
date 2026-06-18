"use client";
import { useState } from "react";
import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Shield } from "lucide-react";

export default function GymSignUp() {
  const [gymName, setGymName] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-between px-7 py-3.5 border-b border-gray-100 bg-white">
        <Link href="/" className="flex items-center gap-2 text-base font-medium">
          <Shield className="w-5 h-5" style={{ color: "#1D9E75" }} />
          BJJJobs
        </Link>
        <div className="text-xs text-gray-400">Gym sign up</div>
      </div>

      <div className="flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md mb-6 text-center">
          <h1 className="text-xl font-medium mb-1">Create your gym account</h1>
          <p className="text-sm text-gray-500">
            Your name and email are for your login. The gym name is how coaches will find you.
          </p>
        </div>

        <div className="w-full max-w-md mb-4">
          <label className="block text-xs font-medium text-gray-500 mb-1.5">
            Gym name <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-400 bg-white"
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
            forceRedirectUrl="/register/gym"
            signInUrl="/login"
            unsafeMetadata={{ role: "GYM", gymName: gymName.trim() }}
            appearance={{
              elements: {
                rootBox: "w-full max-w-md",
                card: "shadow-none border border-gray-100 rounded-xl",
              },
            }}
          />
        ) : (
          <div className="w-full max-w-md border border-dashed border-gray-200 rounded-xl p-8 text-center text-sm text-gray-400 bg-white">
            Enter your gym name above to continue with your account details.
          </div>
        )}
      </div>
    </div>
  );
}
