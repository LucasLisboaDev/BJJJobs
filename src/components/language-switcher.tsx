"use client";
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
      className="flex items-center gap-0.5 rounded-[9px] p-0.5 bg-fill-tertiary"
      style={{ background: "var(--fill-tertiary)" }}
      role="group"
      aria-label="Language"
    >
      {OPTIONS.map((option) => {
        const active = locale === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setLocale(option.value)}
            className={`text-caption-2 font-semibold px-2.5 py-1 rounded-[7px] transition-all tap border-none ${
              active
                ? "bg-grouped-secondary text-label shadow-ios"
                : "bg-transparent text-label-secondary"
            }`}
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
