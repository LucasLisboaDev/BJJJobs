import Link from "next/link";
import { Shield, Users, Building2 } from "lucide-react";

export default function RegisterRolePicker() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-between px-7 py-3.5 border-b border-gray-100 bg-white">
        <Link href="/" className="flex items-center gap-2 text-base font-medium">
          <Shield className="w-5 h-5" style={{ color: "#1D9E75" }} />
          BJJJobs
        </Link>
        <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900">
          Sign in
        </Link>
      </div>

      <div className="max-w-lg mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-medium mb-2">Create your account</h1>
        <p className="text-sm text-gray-500 mb-10">
          Choose how you&apos;ll use BJJJobs — you can always browse jobs without an account.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/register?role=coach"
            className="flex items-center gap-4 border border-gray-200 rounded-xl px-6 py-5 hover:border-green-400 transition-colors bg-white text-left"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "#E1F5EE" }}
            >
              <Users className="w-5 h-5" style={{ color: "#1D9E75" }} />
            </div>
            <div>
              <div className="text-sm font-medium">I&apos;m a coach</div>
              <div className="text-xs text-gray-500 mt-0.5">
                Build a profile, browse jobs, and apply to gyms
              </div>
            </div>
          </Link>

          <Link
            href="/register?role=gym"
            className="flex items-center gap-4 border border-gray-200 rounded-xl px-6 py-5 hover:border-green-400 transition-colors bg-white text-left"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "#E1F5EE" }}
            >
              <Building2 className="w-5 h-5" style={{ color: "#1D9E75" }} />
            </div>
            <div>
              <div className="text-sm font-medium">I&apos;m a gym</div>
              <div className="text-xs text-gray-500 mt-0.5">
                Create your gym profile and post open positions
              </div>
            </div>
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-8">
          Already have an account?{" "}
          <Link href="/login" className="font-medium" style={{ color: "#1D9E75" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
