import type { ru } from "./locales/ru";

export type Language = "ru" | "en";

export type TranslationKey = keyof typeof ru;