"use client";

import { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");

  // Load from localStorage on first mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("tedx-lang");
    if (saved === "ar" || saved === "en") {
      setLang(saved);
    }
  }, []);

  // Persist + update <html dir/lang> on change
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("tedx-lang", lang);

    const dir = lang === "ar" ? "rtl" : "ltr";
    const htmlLang = lang === "ar" ? "ar" : "en";

    document.documentElement.dir = dir;
    document.documentElement.lang = htmlLang;
  }, [lang]);

  const value = {
    lang,
    isArabic: lang === "ar",
    setLang,
    toggleLang: () => setLang((prev) => (prev === "en" ? "ar" : "en")),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
