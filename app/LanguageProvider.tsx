"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from "react";
import {
  translations,
  SUPPORTED_LOCALES,
  type Locale,
  type TranslationDict,
} from "../lib/i18n/translations";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationDict;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: "en",
  setLocale: () => {},
  t: translations.en,
});

export function useTranslation() {
  return useContext(LanguageContext);
}

export default function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read persisted language from localStorage
    const stored = localStorage.getItem("thenode-locale") as Locale | null;
    if (stored && translations[stored]) {
      setLocaleState(stored);
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.slice(0, 2) as Locale;
      if (translations[browserLang]) {
        setLocaleState(browserLang);
      }
    }
    setMounted(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("thenode-locale", newLocale);
    // Update <html lang="...">
    document.documentElement.lang = newLocale;
  };

  // Keep <html lang> in sync
  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = locale;
    }
  }, [locale, mounted]);

  const t = translations[locale] ?? translations.en;

  if (!mounted) {
    // SSR / before hydration – render with English to avoid mismatch
    return (
      <LanguageContext.Provider
        value={{ locale: "en", setLocale, t: translations.en }}
      >
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

/** Compact language switcher dropdown */
export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = SUPPORTED_LOCALES.find((l) => l.code === locale);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Change language"
        className="flex h-8 items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2 text-sm transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-[#252530] dark:hover:bg-[#2f2f3d]"
      >
        <span>{current?.flag}</span>
        <span className="hidden text-xs font-medium text-zinc-600 dark:text-zinc-300 sm:inline">
          {current?.code.toUpperCase()}
        </span>
        <svg
          className={`h-3 w-3 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-44 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-[#252530]">
          {SUPPORTED_LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLocale(l.code);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-[#2f2f3d] ${
                locale === l.code
                  ? "bg-zinc-50 font-semibold text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100"
                  : "text-zinc-600 dark:text-zinc-300"
              }`}
            >
              <span>{l.flag}</span>
              <span>{l.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

