"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, Locale, Translations } from "@/i18n/translations";

interface LanguageContextType {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr");

  // Load locale from localStorage on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem("preferredLanguage") as Locale;
    if (savedLocale && (savedLocale === "fr" || savedLocale === "en")) {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("preferredLanguage", newLocale);
    // Update HTML lang attribute for accessibility
    document.documentElement.lang = newLocale;
  };

  const toggleLocale = () => {
    const nextLocale = locale === "fr" ? "en" : "fr";
    setLocale(nextLocale);
  };

  const t = translations[locale];

  return (
    <LanguageContext.Provider value={{ locale, t, setLocale, toggleLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
