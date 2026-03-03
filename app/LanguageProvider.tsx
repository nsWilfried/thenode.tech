"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  translations,
  SUPPORTED_LOCALES,
  type Locale,
  type TranslationDict,
} from "../lib/i18n/translations";
import { isValidLocale } from "../lib/i18n/locales";

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

function getPathWithoutLocale(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && isValidLocale(segments[0])) {
    return "/" + segments.slice(1).join("/");
  }
  return pathname || "/";
}

export default function LanguageProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  // Sync locale from URL (pathname first segment)
  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 0 && isValidLocale(segments[0])) {
      const urlLocale = segments[0] as Locale;
      setLocaleState(urlLocale);
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("thenode-locale", urlLocale);
      }
    }
  }, [pathname]);

  // Initial mount: if URL has no locale yet, use localStorage or browser
  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0 || !isValidLocale(segments[0])) {
      const stored = localStorage.getItem("thenode-locale") as Locale | null;
      if (stored && translations[stored]) {
        setLocaleState(stored);
      } else {
        const browserLang = navigator.language.slice(0, 2) as Locale;
        if (translations[browserLang]) {
          setLocaleState(browserLang);
        }
      }
    }
    setMounted(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("thenode-locale", newLocale);
    document.documentElement.lang = newLocale;
    const pathWithoutLocale = getPathWithoutLocale(pathname);
    const newPath = pathWithoutLocale === "/" ? `/${newLocale}` : `/${newLocale}${pathWithoutLocale}`;
    router.push(newPath);
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
    <div ref={ref} className="relative inline-flex">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Change language"
        className="flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 text-sm transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-dark-surface dark:hover:bg-dark-hover"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-50 text-xs dark:bg-zinc-800">
          {current?.flag}
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
        <div
          className="absolute left-0 z-50 mt-1 w-44 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-dark-surface sm:left-auto sm:right-0"
        >
          {SUPPORTED_LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLocale(l.code);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-dark-hover ${
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

