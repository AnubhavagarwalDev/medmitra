import { useEffect, useState } from "react";

const STORAGE_KEY = "medmitra-language";

export function useLanguage(defaultLanguage = "en") {
  const [language, setLanguage] = useState(() => {
    if (typeof window === "undefined") {
      return defaultLanguage;
    }

    return window.localStorage.getItem(STORAGE_KEY) || defaultLanguage;
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language === "hi" ? "hi" : "en";
  }, [language]);

  return [language, setLanguage];
}
