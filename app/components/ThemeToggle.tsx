"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

// Desktop nav and mobile top bar each mount their own ThemeToggle; this event
// keeps both buttons' icons in sync when either one is clicked.
const THEME_EVENT = "portfolio-theme-change";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));

    const handleThemeChange = (e: Event) => {
      setIsDark((e as CustomEvent<boolean>).detail);
    };
    window.addEventListener(THEME_EVENT, handleThemeChange);
    return () => window.removeEventListener(THEME_EVENT, handleThemeChange);
  }, []);

  const toggle = () => {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // localStorage unavailable (private browsing, blocked storage) — theme
      // just won't persist across visits.
    }
    window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: next }));
  };

  if (!mounted) {
    return <div className="h-9 w-9" aria-hidden="true" />;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground hover:text-primary hover:bg-secondary transition-colors"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
