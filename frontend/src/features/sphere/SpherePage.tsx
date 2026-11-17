
import { useMemo, useState } from "react";

import { calculateSphere } from "../../domain/geometry/sphere/sphere";
import SphereVisualization from "./components/SphereVisualization";
import { useI18n } from "../../app/providers/I18nProvider";
import { saveCalculation } from "../../shared/api/history";
import "./SpherePage.scss";

export default function SpherePage()  {
  const { t } = useI18n();

  const [radius, setRadius] = useState("5");

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState(false);

  const numericRadius = Number(radius);

  const isValid =
    radius.trim() !== "" &&
    Number.isFinite(numericRadius) &&
    numericRadius > 0;

  const results = useMemo(() => {
    if (!isValid) return null;

    return calculateSphere({
      radius: numericRadius,
    });
  }, [isValid, numericRadius]);

  const format = (value: number) =>
    Number(value.toFixed(2)).toString();

  function updateRadius(value: string) {
    setRadius(value);
    setSaveMessage("");
    setSaveError(false);
  }

  async function handleSave() {
    if (!results || saving) return;

    setSaving(true);
    setSaveMessage("");
    setSaveError(false);

    try {
      await saveCalculation(
        "SPHERE",
        {
          radius: numericRadius,
        },
        {
          surfaceArea: results.surfaceArea,
          volume: results.volume,
        }
      );

      setSaveMessage(t("savedSuccessfully"));
    } catch {
      setSaveError(true);
      setSaveMessage(t("sphereSaveError"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="sphere-page">
      <header className="sphere-page__header">
        <h1>{t("sphereTitle")}</h1>

        <p>{t("sphereSubtitle")}</p>
      </header>

      <div className="sphere-page__top">
        <div className="sphere-card sphere-inputs">
          <h2>{t("sphereParameters")}</h2>

          <label htmlFor="sphere-radius">
            {t("radius")} (R)
          </label>

          <input
            id="sphere-radius"
            type="number"
            min="0.01"
            step="any"
            value={radius}
            onChange={(event) =>
              updateRadius(event.target.value)
            }
            placeholder={t("enterRadius")}
          />

          {!isValid && (
            <p className="sphere-error" role="alert">
              {t("invalidSphere")}
            </p>
          )}

          <div className="sphere-inputs__formula">
            <span>{t("surfaceArea")}</span>
            <strong>S = 4πR²</strong>
          </div>

          <div className="sphere-inputs__formula">
            <span>{t("volume")}</span>
            <strong>V = 4/3πR³</strong>
          </div>
        </div>

        <div className="sphere-card sphere-card--visual">
          <h2>{t("visualization")}</h2>

          {isValid ? (
            <SphereVisualization radius={numericRadius} />
          ) : (
            <p className="sphere-error">
              {t("correctSphere")}
            </p>
          )}
        </div>
      </div>

      {results && (
        <section className="sphere-results">
          <h2 className="sphere-results__title">
            {t("resultsAndSolution")}
          </h2>

          <div className="sphere-results__grid">
            <article className="sphere-result-card">
              <span className="sphere-result-card__label">
                {t("surfaceArea")}
              </span>

              <strong className="sphere-result-card__value">
                {format(results.surfaceArea)}
              </strong>

              <div className="sphere-result-card__details">
                <span>{t("formula")}</span>
                <p>S = 4πR²</p>

                <span>{t("solution")}</span>
                <p>
                  S = 4 × π × {format(numericRadius)}²
                </p>
                <p>
                  S = 4 × π × {format(numericRadius ** 2)}
                </p>
                <p>
                  S ={" "}
                  <strong>{format(results.surfaceArea)}</strong>
                </p>
              </div>
            </article>

            <article className="sphere-result-card">
              <span className="sphere-result-card__label">
                {t("sphereVolume")}
              </span>

              <strong className="sphere-result-card__value">
                {format(results.volume)}
              </strong>

              <div className="sphere-result-card__details">
                <span>{t("formula")}</span>
                <p>V = 4/3πR³</p>

                <span>{t("solution")}</span>
                <p>
                  V = 4/3 × π × {format(numericRadius)}³
                </p>
                <p>
                  V = 4/3 × π × {format(numericRadius ** 3)}
                </p>
                <p>
                  V = <strong>{format(results.volume)}</strong>
                </p>
              </div>
            </article>
          </div>

          <div className="sphere-save">
            <button
              type="button"
              className="sphere-save__button"
              onClick={() => void handleSave()}
              disabled={saving}
            >
              {saving ? t("saving") : t("saveToHistory")}
            </button>

            {saveMessage && (
              <p
                className={`sphere-save__message ${
                  saveError
                    ? "sphere-save__message--error"
                    : ""
                }`}
                role="status"
              >
                {saveMessage}
              </p>
            )}
          </div>
        </section>
      )}
    </section>
  );
}
