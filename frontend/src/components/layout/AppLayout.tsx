
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";

import { useI18n } from "../../app/providers/I18nProvider";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";

export function AppLayout() {
  const { lang } = useParams();
  const navigate = useNavigate();

  const { language, setLanguage } = useI18n();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Проверяем язык маршрута
  useEffect(() => {
    if (lang !== "ru" && lang !== "en") {
      navigate("/ru", { replace: true });
      return;
    }

    if (lang !== language) {
      setLanguage(lang);
    }
  }, [lang, language, setLanguage, navigate]);

  // Закрываем меню при смене языка
  useEffect(() => {
    setIsMenuOpen(false);
  }, [lang]);

  // Закрываем меню клавишей Escape
  // и блокируем прокрутку страницы, пока меню открыто
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  if (lang !== "ru" && lang !== "en") {
    return null;
  }

  return (
    <div className="app">
      <Header
        onMenuToggle={() => setIsMenuOpen((open) => !open)}
        isMenuOpen={isMenuOpen}
      />

      <div className="app-body">
        {/* Затемнение фона при открытом меню */}
        {isMenuOpen && (
          <button
            type="button"
            className="sidebar-overlay"
            aria-label="Закрыть меню"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Боковая панель навигации */}
        <Sidebar
          isOpen={isMenuOpen}
          onNavigate={() => setIsMenuOpen(false)}
        />

        {/* Основное содержимое страницы */}
        <main className="app-content">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}
