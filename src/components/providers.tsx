"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { LanguageProvider, useLanguage } from "@/components/language-provider";
import { getClerkLocalization } from "@/lib/clerk-localization";

function ClerkWithLocale({ children }: { children: React.ReactNode }) {
  const { locale } = useLanguage();

  return (
    <ClerkProvider localization={getClerkLocalization(locale)}>{children}</ClerkProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ClerkWithLocale>{children}</ClerkWithLocale>
    </LanguageProvider>
  );
}
