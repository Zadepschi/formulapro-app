import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  translations,
  type Language,
  type TranslationKey,
} from "../../shared/config/i18n";
export type { Language } from "../../shared/config/i18n";

interface I18nContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<
  I18nContextType | undefined
>(undefined);

const STORAGE_KEY = "formulapro:language";

function getInitialLanguage(): Language {
  if (typeof window === "undefined") {
    return "en";
  }

  const savedLanguage = localStorage.getItem(STORAGE_KEY);

  if (savedLanguage === "ru" || savedLanguage === "en") {
    return savedLanguage;
  }

  return "en";
}

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({
  children,
}: I18nProviderProps) {
  const [language, setLanguage] =
    useState<Language>(getInitialLanguage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: TranslationKey): string => {
    return translations[language][key];
  };

  return (
    <I18nContext.Provider
      value={{ language, setLanguage, t }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error(
      "useI18n must be used inside I18nProvider"
    );
  }

  return context;
}