"use client";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useLanguage } from "@/components/language-provider";
import LanguageSwitcher from "@/components/language-switcher";
import { Logo } from "@/components/ui/logo";

type AppNavProps = {
  variant?: "floating" | "sticky";
  showBeta?: boolean;
};

export function AppNav({ variant = "floating", showBeta = false }: AppNavProps) {
  const { t } = useLanguage();

  const links = (
    <>
      <Link
        href="/jobs"
        className="text-subheadline font-semibold text-label-secondary hover:text-label transition-colors px-3.5 py-1.5 rounded-capsule"
      >
        {t("nav.browseJobs")}
      </Link>
      <Link
        href="/about"
        className="text-subheadline font-semibold text-label-secondary hover:text-label transition-colors px-3.5 py-1.5 rounded-capsule"
      >
        {t("nav.aboutUs")}
      </Link>
      <LanguageSwitcher />
      <SignedOut>
        <Link
          href="/login"
          className="text-subheadline font-semibold text-label-secondary hover:text-label transition-colors px-3.5 py-1.5"
        >
          {t("nav.signIn")}
        </Link>
        <Link href="/register" className="btn-primary text-sm !py-2 !px-4">
          {t("nav.createAccount")}
        </Link>
      </SignedOut>
      <SignedIn>
        <Link
          href="/dashboard"
          className="text-subheadline font-semibold text-label-secondary hover:text-label transition-colors px-3.5 py-1.5"
        >
          {t("nav.dashboard")}
        </Link>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </>
  );

  if (variant === "sticky") {
    return (
      <nav className="sticky top-0 z-50 px-4 py-3 bg-grouped-secondary/90 backdrop-blur-xl border-b border-separator/30">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Logo />
            {showBeta && (
              <span className="text-caption-2 font-semibold text-white bg-brand px-2 py-0.5 rounded-capsule">
                BETA
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">{links}</div>
        </div>
      </nav>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-3 pb-2 pointer-events-none">
      <nav className="lg-bar max-w-4xl mx-auto flex items-center justify-between gap-3 px-4 py-2 pointer-events-auto">
        <div className="flex items-center gap-2">
          <Logo />
          {showBeta && (
            <span className="text-caption-2 font-semibold text-white bg-brand px-2 py-0.5 rounded-capsule">
              BETA
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-end">{links}</div>
      </nav>
    </header>
  );
}
