export const locales = ["es", "en"] as const;
export const defaultLocale = "es" as const;

export type Locale = (typeof locales)[number];

export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split("/");
  const potentialLocale = segments[1];
  
  if (locales.includes(potentialLocale as Locale)) {
    return potentialLocale as Locale;
  }
  
  return defaultLocale;
}
