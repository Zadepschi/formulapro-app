
import { Link, useParams } from "react-router-dom";
import { useI18n } from "../../app/providers/I18nProvider";
import "./HomePage.scss";

const figures2D = [
  { path: "circle", label: "circle", symbol: "◯" },
  { path: "triangle", label: "triangle", symbol: "△" },
  { path: "parallelogram", label: "parallelogram", symbol: "▱" },
] as const;

const figures3D = [
  { path: "sphere", label: "sphere", symbol: "●" },
  { path: "cone", label: "cone", symbol: "▲" },
  { path: "prism", label: "prism", symbol: "▰" },
] as const;

export function HomePage() {
  const { language, t } = useI18n();
  const { lang } = useParams();

  const currentLanguage = lang || language;

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-label">FORMULAPRO</span>

          <h1>{t("welcome")}</h1>

          <p>{t("description")}</p>

          <Link
            to={`/${currentLanguage}/circle`}
            className="hero-button"
          >
            {t("calculators")}
            <span>→</span>
          </Link>
        </div>

        <div className="hero-decoration" aria-hidden="true">
          <div className="hero-circle">π</div>
          <div className="hero-triangle">△</div>
          <div className="hero-square">∑</div>
        </div>
      </section>

      <section className="geometry-section">
        <div className="section-heading">
          <h2>{t("calculators")} — 2D</h2>
        </div>

        <div className="figure-grid">
          {figures2D.map((figure) => (
            <Link
              key={figure.path}
              to={`/${currentLanguage}/${figure.path}`}
              className="figure-card"
            >
              <span className="figure-symbol">{figure.symbol}</span>
              <h3>{t(figure.label)}</h3>
              <span className="card-arrow">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="geometry-section">
        <div className="section-heading">
          <h2>{t("calculators")} — 3D</h2>
        </div>

        <div className="figure-grid">
          {figures3D.map((figure) => (
            <Link
              key={figure.path}
              to={`/${currentLanguage}/${figure.path}`}
              className="figure-card"
            >
              <span className="figure-symbol">{figure.symbol}</span>
              <h3>{t(figure.label)}</h3>
              <span className="card-arrow">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-extra-grid">
        <Link
          to={`/${currentLanguage}/quiz`}
          className="extra-card quiz-card"
        >
          <span className="extra-icon">✦</span>
          <h2>{t("quiz")}</h2>
          <span className="card-arrow">→</span>
        </Link>

        <Link
          to={`/${currentLanguage}/history`}
          className="extra-card history-card"
        >
          <span className="extra-icon">◷</span>
          <h2>{t("history")}</h2>
          <span className="card-arrow">→</span>
        </Link>
      </section>
    </div>
  );
}
