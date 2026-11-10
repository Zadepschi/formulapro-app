
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
    about: "О проекте",

    welcome: "Добро пожаловать в FormulaPro",
    description:
      "Изучайте геометрию, выполняйте расчёты и проверяйте свои знания.",

    language: "Язык",
    theme: "Тема",
    light: "Светлая",
    dark: "Тёмная",
    pastel: "Пастельная",

    aboutTitle: "О проекте FormulaPro",
    aboutSubtitle: "Математика становится проще",

    aboutDescriptionTitle: "О приложении",
    aboutDescription:
      "FormulaPro — приложение для математических вычислений, изучения геометрии и проверки знаний. Оно помогает выполнять расчёты, изучать геометрические фигуры и лучше понимать математические формулы.",

    aboutFeaturesTitle: "Возможности приложения",
    aboutFeature2D:
      "2D-калькуляторы: круг, треугольник и параллелограмм.",
    aboutFeature3D:
      "3D-калькуляторы: сфера, конус и прямоугольная призма.",
    aboutFeatureQuiz:
      "Тест знаний для проверки понимания математики.",
    aboutFeatureHistory:
      "История вычислений для просмотра предыдущих результатов.",
    aboutFeatureLanguages:
      "Поддержка русского и английского языков.",
    aboutFeatureThemes:
      "Светлая и тёмная темы оформления.",

    aboutMissionTitle: "Наша цель",
    aboutMission:
      "Сделать математические вычисления понятными, доступными и удобными для каждого. Мы стремимся объединить обучение и практику в одном приложении.",

    aboutVersion: "Версия",
    aboutCopyright: "Все права защищены.",
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
    about: "About",

    welcome: "Welcome to FormulaPro",
    description:
      "Explore geometry, perform calculations, and test your knowledge.",

    language: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    pastel: "Pastel",

    aboutTitle: "About FormulaPro",
    aboutSubtitle: "Making mathematics easier",

    aboutDescriptionTitle: "About the application",
    aboutDescription:
      "FormulaPro is an application for mathematical calculations, learning geometry, and testing your knowledge. It helps users perform calculations, explore geometric shapes, and better understand mathematical formulas.",

    aboutFeaturesTitle: "Application features",
    aboutFeature2D:
      "2D calculators: circle, triangle, and parallelogram.",
    aboutFeature3D:
      "3D calculators: sphere, cone, and rectangular prism.",
    aboutFeatureQuiz:
      "Knowledge test to check your understanding of mathematics.",
    aboutFeatureHistory:
      "Calculation history for reviewing previous results.",
    aboutFeatureLanguages:
      "Russian and English language support.",
    aboutFeatureThemes:
      "Light and dark themes.",

    aboutMissionTitle: "Our mission",
    aboutMission:
      "To make mathematical calculations understandable, accessible, and convenient for everyone. We aim to combine learning and practice in one application.",

    aboutVersion: "Version",
    aboutCopyright: "All rights reserved.",
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
