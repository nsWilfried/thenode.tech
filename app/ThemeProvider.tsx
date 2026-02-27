"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // On mount, read saved preference from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("thenode-theme") as Theme | null;
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
    }
    setMounted(true);
  }, []);

  // Apply / remove the "dark" class on <html>
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("thenode-theme", theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Prevent flash of wrong theme on first render
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/** A small sun/moon toggle button you can drop into any header. */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-sm transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-dark-surface dark:hover:bg-dark-hover"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}

