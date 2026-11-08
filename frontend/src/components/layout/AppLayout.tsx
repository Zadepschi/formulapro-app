
import { useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";

import { useI18n } from "../../app/providers/I18nProvider";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";

export function AppLayout() {
  const { lang } = useParams();
  const navigate = useNavigate();

  const { language, setLanguage } = useI18n();

  useEffect(() => {
    if (lang !== "ru" && lang !== "en") {
      navigate("/ru", { replace: true });
      return;
    }

    if (lang !== language) {
      setLanguage(lang);
    }
  }, [lang, language, setLanguage, navigate]);

  if (lang !== "ru" && lang !== "en") {
    return null;
  }

  return (
    <div className="app">
      <Header />

      <div className="app-body">
        <Sidebar />

        <main className="app-content">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}
