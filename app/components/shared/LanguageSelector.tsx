"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/app/lib/utils";
import { locales, type Locale } from "@/app/i18n/config";

const localeNames: Record<Locale, string> = {
  es: "Español",
  en: "English",
};

const localeFlags: Record<Locale, string> = {
  es: "🇪🇸",
  en: "🇺🇸",
};

export default function LanguageSelector() {
  const t = useTranslations("languageSelector");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLocaleChange = (newLocale: Locale) => {
    // Remove current locale from pathname and add new one
    const segments = pathname.split("/");
    if (locales.includes(segments[1] as Locale)) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    const newPath = segments.join("/") || "/";
    router.push(newPath);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-full",
          "bg-[var(--secondary)] hover:bg-[var(--secondary-hover)]",
          "text-[var(--foreground)] text-sm font-medium",
          "transition-all duration-200",
          "border border-[var(--border)]",
          isOpen && "ring-2 ring-[var(--ring)]"
        )}
        aria-label="Select language"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{localeFlags[locale]} {localeNames[locale]}</span>
        <span className="sm:hidden">{localeFlags[locale]}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 py-2 w-40 bg-[var(--card)] border border-[var(--card-border)] rounded-[var(--radius-lg)] shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => handleLocaleChange(loc)}
              className={cn(
                "w-full px-4 py-2 text-left text-sm flex items-center gap-2",
                "hover:bg-[var(--secondary)] transition-colors",
                locale === loc
                  ? "text-[var(--primary)] font-medium bg-[var(--primary)]/5"
                  : "text-[var(--foreground)]"
              )}
            >
              <span>{localeFlags[loc]}</span>
              <span>{localeNames[loc]}</span>
              {locale === loc && (
                <span className="ml-auto text-[var(--primary)]">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
