"use client";
import { useState } from "react";
import { useLanguage } from "@/components/language-provider";
import LanguageSwitcher from "@/components/language-switcher";
import { LocalizedSignUp } from "@/components/localized-sign-up";
import { Logo } from "@/components/ui/logo";
import { STORAGE_KEYS } from "@/lib/brand";

export default function GymSignUp() {
  const { t } = useLanguage();
  const [gymName, setGymName] = useState("");

  return (
    <div className="min-h-screen bg-grouped">
      <div className="sticky top-0 z-50 px-4 py-3 bg-grouped-secondary/90 backdrop-blur-xl border-b border-separator/30">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <div className="text-caption-1 text-label-tertiary">{t("register.gymSignUp.badge")}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md mb-6 text-center">
          <h1 className="text-title-2 mb-1">{t("register.gymSignUp.title")}</h1>
          <p className="text-subheadline text-label-secondary">{t("register.gymSignUp.sub")}</p>
        </div>

        <div className="w-full max-w-md mb-4">
          <label className="field-label">
            {t("register.gymSignUp.gymNameLabel")} <span className="text-red-500">*</span>
          </label>
          <input
            className="ios-field"
            placeholder={t("register.gymSignUp.gymNamePlaceholder")}
            value={gymName}
            onChange={(e) => {
              setGymName(e.target.value);
              sessionStorage.setItem(STORAGE_KEYS.gymName, e.target.value);
              sessionStorage.setItem(STORAGE_KEYS.signupRole, "GYM");
            }}
          />
        </div>

        {gymName.trim() ? (
          <LocalizedSignUp
            path="/register/gym/account"
            routing="path"
            forceRedirectUrl="/register/gym"
            signInUrl="/login"
            unsafeMetadata={{ role: "GYM", gymName: gymName.trim() }}
            appearance={{
              elements: {
                rootBox: "w-full max-w-md",
                card: "shadow-ios border-none rounded-ios-lg bg-grouped-secondary",
              },
            }}
          />
        ) : (
          <div className="w-full max-w-md border-2 border-dashed border-separator/40 rounded-ios-lg p-8 text-center text-subheadline text-label-tertiary ios-card">
            {t("register.gymSignUp.enterGymNameHint")}
          </div>
        )}
      </div>
    </div>
  );
}
