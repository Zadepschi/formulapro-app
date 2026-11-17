
import { useMemo, useState } from "react";

import { calculatePrism } from "../../domain/geometry/prism/prism";
import PrismVisualization from "./components/PrismVisualization";
import { useI18n } from "../../app/providers/I18nProvider";
import { saveCalculation } from "../../shared/api/history";
import "./PrismPage.scss";

export default function PrismPage() {
  const { language, t } = useI18n();

  const [length, setLength] = useState("3");
  const [width, setWidth] = useState("2");
  const [height, setHeight] = useState("1");

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState(false);

  const lengthValue = Number(length);
  const widthValue = Number(width);
  const heightValue = Number(height);

  const isValid =
    length.trim() !== "" &&
    width.trim() !== "" &&
    height.trim() !== "" &&
    Number.isFinite(lengthValue) &&
    Number.isFinite(widthValue) &&
    Number.isFinite(heightValue) &&
    lengthValue > 0 &&
    widthValue > 0 &&
    heightValue > 0;

  const results = useMemo(() => {
    if (!isValid) return null;

    try {
      return calculatePrism({
        length: lengthValue,
        width: widthValue,
        height: heightValue,
      });
    } catch {
      return null;
    }
  }, [lengthValue, widthValue, heightValue, isValid]);

  const formatNumber = (value: number) =>
    new Intl.NumberFormat(language === "ru" ? "ru-RU" : "en-US", {
      maximumFractionDigits: 2,
    }).format(value);

  const handleInputChange = (
    setter: (value: string) => void,
    value: string
  ) => {
    setter(value);
    setSaveMessage("");
    setSaveError(false);
  };

  const handleSave = async () => {
    if (!results || !isValid || saving) return;

    setSaving(true);
    setSaveMessage("");
    setSaveError(false);

    try {
      await saveCalculation(
        "PRISM",
        {
          length: lengthValue,
          width: widthValue,
          height: heightValue,
        },
        {
          volume: results.volume,
          surfaceArea: results.surfaceArea,
        }
      );

      setSaveMessage(t("savedSuccessfully"));
    } catch {
      setSaveError(true);
      setSaveMessage(t("prismSaveError"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="prism-page">
      <div className="prism-page__heading">
        <h1>{t("prismTitle")}</h1>

        <p>{t("prismSubtitle")}</p>
      </div>

      <div className="prism-page__main">
        <section className="prism-card prism-card--inputs">
          <h2>{t("prismParameters")}</h2>

          <div className="prism-field">
            <label htmlFor="prism-length">
              {t("length")} (a)
            </label>

            <input
              id="prism-length"
              type="number"
              min="0"
              step="0.1"
              value={length}
              onChange={(event) =>
                handleInputChange(setLength, event.target.value)
              }
              placeholder={t("enterLength")}
            />
          </div>

          <div className="prism-field">
            <label htmlFor="prism-width">
              {t("width")} (b)
            </label>

            <input
              id="prism-width"
              type="number"
              min="0"
              step="0.1"
              value={width}
              onChange={(event) =>
                handleInputChange(setWidth, event.target.value)
              }
              placeholder={t("enterWidth")}
            />
          </div>

          <div className="prism-field">
            <label htmlFor="prism-height">
              {t("height")} (h)
            </label>

            <input
              id="prism-height"
              type="number"
              min="0"
              step="0.1"
              value={height}
              onChange={(event) =>
                handleInputChange(setHeight, event.target.value)
              }
              placeholder={t("enterHeight")}
            />
          </div>

          {!isValid && (
            <p className="prism-error" role="alert">
              {t("invalidPrism")}
            </p>
          )}
        </section>

        <section className="prism-card prism-card--visual">
          <h2>{t("prismVisualization")}</h2>

          {results && (
            <PrismVisualization
              length={results.length}
              width={results.width}
              height={results.height}
            />
          )}
        </section>
      </div>

      <section className="prism-results">
        <h2>{t("prismResults")}</h2>

        {results ? (
          <div className="prism-results__grid">
            <article className="prism-result-card">
              <span className="prism-result-card__label">
                {t("prismVolume")}
              </span>

              <strong className="prism-result-card__value">
                {formatNumber(results.volume)}
              </strong>

              <div className="prism-result-card__formula">
                <strong>V = a × b × h</strong>

                <span>
                  {`V = ${formatNumber(lengthValue)} × ${formatNumber(widthValue)} × ${formatNumber(heightValue)}`}
                </span>

                <span>
                  {`V = ${formatNumber(results.volume)}`}
                </span>
              </div>
            </article>

            <article className="prism-result-card">
              <span className="prism-result-card__label">
                {t("totalSurfaceArea")}
              </span>

              <strong className="prism-result-card__value">
                {formatNumber(results.surfaceArea)}
              </strong>

              <div className="prism-result-card__formula">
                <strong>S = 2(ab + ah + bh)</strong>

                <span>
                  {`S = 2 × (${formatNumber(lengthValue)} × ${formatNumber(widthValue)} + ${formatNumber(lengthValue)} × ${formatNumber(heightValue)} + ${formatNumber(widthValue)} × ${formatNumber(heightValue)})`}
                </span>

                <span>
                  {`S = ${formatNumber(results.surfaceArea)}`}
                </span>
              </div>
            </article>
          </div>
        ) : (
          <div className="prism-results__empty">
            {t("prismEmptyResults")}
          </div>
        )}
      </section>

      {results && (
        <div className="prism-save">
          <button
            type="button"
            className="prism-save__button"
            onClick={() => void handleSave()}
            disabled={saving || !isValid}
          >
            {saving ? t("saving") : t("saveToHistory")}
          </button>

          {saveMessage && (
            <p
              className={`prism-save__message ${
                saveError ? "prism-save__message--error" : ""
              }`}
              role="status"
            >
              {saveMessage}
            </p>
          )}
        </div>
      )}
    </main>
  );
}
