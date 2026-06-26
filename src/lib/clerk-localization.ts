import { enUS, ptBR } from "@clerk/localizations";
import type { Locale } from "@/lib/i18n/types";

/** App copy defaults to English; Clerk must not fall back to the browser locale. */
export function getClerkLocalization(locale: Locale) {
  return locale === "pt-BR" ? ptBR : enUS;
}
