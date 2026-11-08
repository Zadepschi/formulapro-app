import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Language = "ru" | "en";

const translations = {
  ru: {
    appName: "FormulaPro",
    home: "Главная",
    calculators: "Калькуляторы",
    circle: "Круг",
    triangle: "Треугольник",
    sphere: "Сфера",
    cone: "Конус",
    prism: "Прямоугольная призма",
    parallelogram: "Параллелограмм",
    quiz: "Тест знаний",
    history: "История вычислений",
    settings: "Настройки",
    welcome: "Добро пожаловать в FormulaPro",
    description:
      "Изучайте геометрию, выполняйте расчёты и проверяйте свои знания.",
    language: "Язык",
    theme: "Тема",
    light: "Светлая",
    dark: "Тёмная",
    system: "Системная",
  },

  en: {
    appName: "FormulaPro",
    home: "Home",
    calculators: "Calculators",
    circle: "Circle",
    triangle: "Triangle",
    sphere: "Sphere",
    cone: "Cone",
    prism: "Rectangular Prism",
    parallelogram: "Parallelogram",
    quiz: "Knowledge Test",
    history: "Calculation History",
    settings: "Settings",
    welcome: "Welcome to FormulaPro",
    description:
      "Explore geometry, perform calculations, and test your knowledge.",
    language: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    system: "System",
  },
};

type TranslationKey = keyof typeof translations.ru;

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
    return "ru";
  }

  const savedLanguage = localStorage.getItem(STORAGE_KEY);

  if (savedLanguage === "ru" || savedLanguage === "en") {
    return savedLanguage;
  }

  return navigator.language.toLowerCase().startsWith("ru")
    ? "ru"
    : "en";
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