import { SignUp } from "@clerk/nextjs";

const REDIRECTS: Record<string, string> = {
  coach: "/register/coach",
  gym: "/register/gym",
};

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  const redirectUrl = REDIRECTS[searchParams.role ?? ""] ?? "/dashboard";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <SignUp forceRedirectUrl={redirectUrl} signInUrl="/login" />
    </div>
  );
}
