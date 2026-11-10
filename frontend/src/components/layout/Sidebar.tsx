
import { NavLink, useParams } from "react-router-dom";
import { useI18n } from "../../app/providers/I18nProvider";

interface SidebarProps {
  onNavigate: () => void;
  isOpen: boolean;
}

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

export function Sidebar({ onNavigate, isOpen }: SidebarProps) {
  const { language, t } = useI18n();
  const { lang } = useParams();

  const currentLanguage = lang || language;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `sidebar-link ${isActive ? "active" : ""}`;

  return (
    <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
      <nav className="sidebar-navigation">
        <NavLink
          to={`/${currentLanguage}`}
          end
          className={linkClass}
          onClick={onNavigate}
        >
          {t("home")}
        </NavLink>

        <div className="sidebar-group">
          <h3>{t("calculators")} — 2D</h3>

          {figures2D.map((figure) => (
            <NavLink
              key={figure.path}
              to={`/${currentLanguage}/${figure.path}`}
              className={linkClass}
              onClick={onNavigate}
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
              className={linkClass}
              onClick={onNavigate}
            >
              {t(figure.label)}
            </NavLink>
          ))}
        </div>

        <div className="sidebar-group sidebar-group-secondary">
          <NavLink
            to={`/${currentLanguage}/quiz`}
            className={linkClass}
            onClick={onNavigate}
          >
            {t("quiz")}
          </NavLink>

          <NavLink
            to={`/${currentLanguage}/history`}
            className={linkClass}
            onClick={onNavigate}
          >
            {t("history")}
          </NavLink>

          <NavLink
            to={`/${currentLanguage}/settings`}
            className={linkClass}
            onClick={onNavigate}
          >
            {t("aboutTitle")}
          </NavLink>
        </div>
      </nav>
    </aside>
  );
}
