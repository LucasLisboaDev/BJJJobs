import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Shield } from "lucide-react";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirect_url?: string };
}) {
  const redirectUrl = searchParams.redirect_url ?? "/dashboard";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-between px-7 py-3.5 border-b border-gray-100 bg-white">
        <Link href="/" className="flex items-center gap-2 text-base font-medium">
          <Shield className="w-5 h-5" style={{ color: "#1D9E75" }} />
          BJJJobs
        </Link>
        <Link href="/register" className="text-sm text-gray-500 hover:text-gray-900">
          Create an account
        </Link>
      </div>
      <div className="flex items-center justify-center py-12">
        <SignIn signUpUrl="/register" forceRedirectUrl={redirectUrl} />
      </div>
    </div>
  );
}