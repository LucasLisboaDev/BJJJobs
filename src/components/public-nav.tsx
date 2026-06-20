"use client";
import Link from "next/link";
import { Shield } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useLanguage } from "@/components/language-provider";
import LanguageSwitcher from "@/components/language-switcher";

export default function PublicNav() {
  const { t } = useLanguage();

  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white">
      <Link href="/" className="flex items-center gap-2 text-base font-medium">
        <Shield className="w-5 h-5" style={{ color: "#1D9E75" }} />
        BJJJobs
      </Link>

      <div className="flex items-center gap-3">
        <Link href="/jobs" className="text-sm text-gray-500 hover:text-gray-900">
          {t("nav.browseJobs")}
        </Link>
        <Link href="/about" className="text-sm text-gray-500 hover:text-gray-900">
          {t("nav.aboutUs")}
        </Link>
        <LanguageSwitcher />
        <SignedOut>
          <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900">
            {t("nav.signIn")}
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium text-white px-4 py-2 rounded-lg"
            style={{ background: "#1D9E75" }}
          >
            {t("nav.createAccount")}
          </Link>
        </SignedOut>

        <SignedIn>
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900">
            {t("nav.dashboard")}
          </Link>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </nav>
  );
}
