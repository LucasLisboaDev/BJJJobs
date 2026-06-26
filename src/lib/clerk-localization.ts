import { enUS, ptBR } from "@clerk/localizations";
import type { ClerkProvider } from "@clerk/nextjs";
import type { ComponentProps } from "react";
import type { Locale } from "@/lib/i18n/types";

type ClerkLocalization = NonNullable<ComponentProps<typeof ClerkProvider>["localization"]>;

/** @clerk/localizations and @clerk/nextjs disagree on LocalizationResource typing. */
function toClerkLocalization(resource: typeof enUS): ClerkLocalization {
  return resource as ClerkLocalization;
}

/** App copy defaults to English; Clerk must not fall back to the browser locale. */
export const defaultClerkLocalization = toClerkLocalization(enUS);

export function getClerkLocalization(locale: Locale): ClerkLocalization {
  return toClerkLocalization(locale === "pt-BR" ? ptBR : enUS);
}
