"use client";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import LanguageSwitcher from "@/components/language-switcher";
import { Logo } from "@/components/ui/logo";

export default function LoginHeader() {
  const { t } = useLanguage();

  return (
    <div className="sticky top-0 z-50 px-4 py-3 bg-grouped-secondary/90 backdrop-blur-xl border-b border-separator/30">
      <div className="max-w-lg mx-auto flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link href="/register" className="text-subheadline font-semibold text-label-secondary">
            {t("login.createAccount")}
          </Link>
        </div>
      </div>
    </div>
  );
}
