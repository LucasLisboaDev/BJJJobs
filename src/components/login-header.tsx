"use client";
import Link from "next/link";
import { Shield } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import LanguageSwitcher from "@/components/language-switcher";

export default function LoginHeader() {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between px-7 py-3.5 border-b border-gray-100 bg-white">
      <Link href="/" className="flex items-center gap-2 text-base font-medium">
        <Shield className="w-5 h-5" style={{ color: "#1D9E75" }} />
        BJJJobs
      </Link>
      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        <Link href="/register" className="text-sm text-gray-500 hover:text-gray-900">
          {t("login.createAccount")}
        </Link>
      </div>
    </div>
  );
}
