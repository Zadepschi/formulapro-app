
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useI18n, type Language } from "../../app/providers/I18nProvider";
import { useTheme, type Theme } from "../../app/providers/ThemeProvider";

export function Header() {
  const { language, setLanguage, t } = useI18n();
  const { theme, setTheme } = useTheme();

  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useParams();

  const handleLanguageChange = (nextLanguage: Language) => {
    const currentPath = location.pathname.split("/").slice(2).join("/");

    setLanguage(nextLanguage);

    navigate(`/${nextLanguage}${currentPath ? `/${currentPath}` : ""}`);
  };

  return (
    <header className="app-header">
      <Link to={`/${lang || language}`} className="logo">
        FormulaPro
      </Link>

      <div className="header-controls">
        <label className="header-control">
          <span>{t("language")}</span>
          <select
            value={language}
            onChange={(event) =>
              handleLanguageChange(event.target.value as Language)
            }
          >
            <option value="ru">RU</option>
            <option value="en">EN</option>
          </select>
        </label>

        <label className="header-control">
          <span>{t("theme")}</span>
          <select
            value={theme}
            onChange={(event) =>
              setTheme(event.target.value as Theme)
            }
          >
            <option value="light">{t("light")}</option>
            <option value="dark">{t("dark")}</option>
            <option value="system">{t("system")}</option>
          </select>
        </label>
      </div>
    </header>
  );
}
