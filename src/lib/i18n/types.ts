export type Locale = "en" | "pt-BR";

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_STORAGE_KEY = "bjjjobs_locale";

export type TranslationDict = typeof import("./translations/en").en;
