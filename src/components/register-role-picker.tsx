"use client";
import Link from "next/link";
import { Users, Building2 } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import LanguageSwitcher from "@/components/language-switcher";
import { Logo } from "@/components/ui/logo";
import { STORAGE_KEYS } from "@/lib/brand";

export default function RegisterRolePicker() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-grouped">
      <div className="sticky top-0 z-50 px-4 py-3 bg-grouped-secondary/90 backdrop-blur-xl border-b border-separator/30">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link href="/login" className="text-subheadline font-semibold text-label-secondary">
              {t("nav.signIn")}
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 py-16 text-center animate-pop-in">
        <h1 className="text-title-2 mb-2">{t("register.createTitle")}</h1>
        <p className="text-subheadline text-label-secondary mb-10">{t("register.createSub")}</p>

        <div className="flex flex-col gap-3">
          <Link
            href="/register/coach/account"
            onClick={() => sessionStorage.setItem(STORAGE_KEYS.signupRole, "COACH")}
            className="tap lift ios-card-lg flex items-center gap-4 px-6 py-5 text-left"
          >
            <div className="w-11 h-11 rounded-xl bg-brand-light flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-brand" />
            </div>
            <div>
              <div className="text-headline">{t("register.coachTitle")}</div>
              <div className="text-footnote text-label-secondary mt-0.5">
                {t("register.coachDesc")}
              </div>
            </div>
          </Link>

          <Link
            href="/register/gym/account"
            onClick={() => sessionStorage.setItem(STORAGE_KEYS.signupRole, "GYM")}
            className="tap lift ios-card-lg flex items-center gap-4 px-6 py-5 text-left"
          >
            <div className="w-11 h-11 rounded-xl bg-brand-light flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-brand" />
            </div>
            <div>
              <div className="text-headline">{t("register.gymTitle")}</div>
              <div className="text-footnote text-label-secondary mt-0.5">{t("register.gymDesc")}</div>
            </div>
          </Link>
        </div>

        <p className="text-caption-1 text-label-tertiary mt-8">
          {t("register.alreadyHave")}{" "}
          <Link href="/login" className="font-semibold text-brand">
            {t("nav.signIn")}
          </Link>
        </p>
      </div>
    </div>
  );
}
