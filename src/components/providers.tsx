"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { LanguageProvider, useLanguage } from "@/components/language-provider";
import { isClerkE2eBypassEnabled } from "@/lib/clerk-e2e-mode";
import { getClerkLocalization } from "@/lib/clerk-localization";

function ClerkWithLocale({ children }: { children: React.ReactNode }) {
  const { locale } = useLanguage();

  return (
    <ClerkProvider localization={getClerkLocalization(locale)}>{children}</ClerkProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  if (isClerkE2eBypassEnabled()) {
    return <LanguageProvider>{children}</LanguageProvider>;
  }

  return (
    <LanguageProvider>
      <ClerkWithLocale>{children}</ClerkWithLocale>
    </LanguageProvider>
  );
}
