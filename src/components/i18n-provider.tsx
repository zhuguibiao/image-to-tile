import React, { createContext, useContext, useEffect, useState } from "react";
import zh from "@/lib/i18n/zh";
import en from "@/lib/i18n/en";

type Locale = "zh" | "en";
type Messages = typeof zh;

interface I18nContextType {
  locale: Locale;
  t: (key: keyof Messages) => string;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("zh");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Locale | null;
    if (saved) setLocale(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("lang", locale);
  }, [locale]);

  const messages = locale === "zh" ? zh : en;

  const t = (key: keyof Messages) => messages[key] || key;

  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
