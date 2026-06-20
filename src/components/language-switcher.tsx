"use client";
import { Globe } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import type { Locale } from "@/lib/i18n/types";

const OPTIONS: { value: Locale; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "pt-BR", label: "PT" },
];

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      className="flex items-center gap-1 rounded-lg border border-gray-200 p-0.5 bg-white"
      role="group"
      aria-label="Language"
    >
      <Globe className="w-3.5 h-3.5 text-gray-400 ml-1.5 hidden sm:block" />
      {OPTIONS.map((option) => {
        const active = locale === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setLocale(option.value)}
            className="text-xs font-medium px-2.5 py-1 rounded-md transition-colors"
            style={
              active
                ? { background: "#1D9E75", color: "#fff" }
                : { color: "#6b7280" }
            }
            aria-pressed={active}
            title={option.value === "en" ? "English" : "Português (Brasil)"}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
