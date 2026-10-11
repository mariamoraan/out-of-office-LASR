import { es, type Dictionary } from "@/core/i18n/es";

export type Locale = "es";

const dictionaries: Record<Locale, Dictionary> = {
  es,
};

export function getDictionary(locale: Locale = "es"): Dictionary {
  return dictionaries[locale];
}

export { es };
export type { Dictionary };
