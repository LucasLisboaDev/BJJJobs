"use client";
import Link from "next/link";
import { Shield, Users, Building2 } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import LanguageSwitcher from "@/components/language-switcher";

export default function RegisterRolePicker() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-between px-7 py-3.5 border-b border-gray-100 bg-white">
        <Link href="/" className="flex items-center gap-2 text-base font-medium">
          <Shield className="w-5 h-5" style={{ color: "#1D9E75" }} />
          BJJJobs
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900">
            {t("nav.signIn")}
          </Link>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-medium mb-2">{t("register.createTitle")}</h1>
        <p className="text-sm text-gray-500 mb-10">{t("register.createSub")}</p>

        <div className="flex flex-col gap-3">
          <Link
            href="/register/coach/account"
            onClick={() => sessionStorage.setItem("bjjjobs_signup_role", "COACH")}
            className="flex items-center gap-4 border border-gray-200 rounded-xl px-6 py-5 hover:border-green-400 transition-colors bg-white text-left"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "#E1F5EE" }}
            >
              <Users className="w-5 h-5" style={{ color: "#1D9E75" }} />
            </div>
            <div>
              <div className="text-sm font-medium">{t("register.coachTitle")}</div>
              <div className="text-xs text-gray-500 mt-0.5">{t("register.coachDesc")}</div>
            </div>
          </Link>

          <Link
            href="/register/gym/account"
            onClick={() => sessionStorage.setItem("bjjjobs_signup_role", "GYM")}
            className="flex items-center gap-4 border border-gray-200 rounded-xl px-6 py-5 hover:border-green-400 transition-colors bg-white text-left"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "#E1F5EE" }}
            >
              <Building2 className="w-5 h-5" style={{ color: "#1D9E75" }} />
            </div>
            <div>
              <div className="text-sm font-medium">{t("register.gymTitle")}</div>
              <div className="text-xs text-gray-500 mt-0.5">{t("register.gymDesc")}</div>
            </div>
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-8">
          {t("register.alreadyHave")}{" "}
          <Link href="/login" className="font-medium" style={{ color: "#1D9E75" }}>
            {t("nav.signIn")}
          </Link>
        </p>
      </div>
    </div>
  );
}
