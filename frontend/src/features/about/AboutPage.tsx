
import { useI18n } from "../../app/providers/I18nProvider";
import logoFormula from "../../assets/logoFormula.png";
import "./AboutPage.scss";

export function AboutPage() {
  const { t } = useI18n();

  return (
    <main className="page">
      <section className="about-page">
        <header className="about-header">
          <div className="about-logo">
  <img src={logoFormula} alt="FormulaPro" />
</div>

          <div>
            <h1>{t("aboutTitle")}</h1>
            <p>{t("aboutSubtitle")}</p>
          </div>
        </header>

        <section className="about-section">
          <h2>{t("aboutDescriptionTitle")}</h2>
          <p>{t("aboutDescription")}</p>
        </section>

        <section className="about-section">
          <h2>{t("aboutFeaturesTitle")}</h2>

          <ul>
            <li>{t("aboutFeature2D")}</li>
            <li>{t("aboutFeature3D")}</li>
            <li>{t("aboutFeatureQuiz")}</li>
            <li>{t("aboutFeatureHistory")}</li>
            <li>{t("aboutFeatureLanguages")}</li>
            <li>{t("aboutFeatureThemes")}</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>{t("aboutMissionTitle")}</h2>
          <p>{t("aboutMission")}</p>
        </section>

        <footer className="about-footer">
          <p>
            FormulaPro · {t("aboutVersion")} 1.0.0
          </p>
          <p>
            © 2026 FormulaPro. {t("aboutCopyright")}
          </p>
        </footer>
      </section>
    </main>
  );
}
