import { SignIn } from "@clerk/nextjs";
import LoginHeader from "@/components/login-header";
import { LocalizedSignIn } from "@/components/localized-sign-in";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirect_url?: string };
}) {
  const redirectUrl = searchParams.redirect_url ?? "/dashboard";

  return (
    <div className="min-h-screen bg-grouped">
      <LoginHeader />
      <div className="flex items-center justify-center py-12">
        <LocalizedSignIn signUpUrl="/register" forceRedirectUrl={redirectUrl} />
      </div>
    </div>
  );
}
