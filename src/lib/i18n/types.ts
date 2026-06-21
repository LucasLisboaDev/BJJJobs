export type Locale = "en" | "pt-BR";

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_STORAGE_KEY = "bjjjobs_locale";

type StringLeaves<T> = {
  [K in keyof T]: T[K] extends object ? StringLeaves<T[K]> : string;
};

export type TranslationDict = StringLeaves<typeof import("./translations/en").en>;
