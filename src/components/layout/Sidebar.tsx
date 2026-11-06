
import { NavLink, useParams } from "react-router-dom";
import { useI18n } from "../../app/providers/I18nProvider";

const figures2D = [
  { path: "circle", label: "circle" },
  { path: "triangle", label: "triangle" },
  { path: "parallelogram", label: "parallelogram" },
] as const;

const figures3D = [
  { path: "sphere", label: "sphere" },
  { path: "cone", label: "cone" },
  { path: "prism", label: "prism" },
] as const;

export function Sidebar() {
  const { language, t } = useI18n();
  const { lang } = useParams();

  const currentLanguage = lang || language;

  return (
    <aside className="sidebar">
      <nav className="sidebar-navigation">
        <NavLink
          to={`/${currentLanguage}`}
          end
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          {t("home")}
        </NavLink>

        <div className="sidebar-group">
          <h3>{t("calculators")} — 2D</h3>

          {figures2D.map((figure) => (
            <NavLink
              key={figure.path}
              to={`/${currentLanguage}/${figure.path}`}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              {t(figure.label)}
            </NavLink>
          ))}
        </div>

        <div className="sidebar-group">
          <h3>{t("calculators")} — 3D</h3>

          {figures3D.map((figure) => (
            <NavLink
              key={figure.path}
              to={`/${currentLanguage}/${figure.path}`}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              {t(figure.label)}
            </NavLink>
          ))}
        </div>

        <div className="sidebar-group">
          <NavLink
            to={`/${currentLanguage}/quiz`}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            {t("quiz")}
          </NavLink>

          <NavLink
            to={`/${currentLanguage}/history`}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            {t("history")}
          </NavLink>

          <NavLink
            to={`/${currentLanguage}/settings`}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            {t("settings")}
          </NavLink>
        </div>
      </nav>
    </aside>
  );
}
