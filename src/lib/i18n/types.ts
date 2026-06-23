import { STORAGE_KEYS } from "@/lib/brand";

export type Locale = "en" | "pt-BR";

export const DEFAULT_LOCALE: Locale = "en";
export { STORAGE_KEYS };
export const LOCALE_STORAGE_KEY = STORAGE_KEYS.locale;

type StringLeaves<T> = {
  [K in keyof T]: T[K] extends object ? StringLeaves<T[K]> : string;
};

export type TranslationDict = StringLeaves<typeof import("./translations/en").en>;
