import { en } from "./translations/en";
import { ptBR } from "./translations/pt-BR";
import type { Locale } from "./types";

const dictionaries = {
  en,
  "pt-BR": ptBR,
} as const;

export function getTranslation(locale: Locale, key: string): string {
  const keys = key.split(".");
  let value: unknown = dictionaries[locale];

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }

  return typeof value === "string" ? value : key;
}

export { en, ptBR };
