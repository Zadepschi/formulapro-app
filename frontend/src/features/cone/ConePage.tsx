
import { useMemo, useState } from "react";

import { calculateCone } from "../../domain/geometry/cone/cone";
import { saveCalculation } from "../../shared/api/history";
import { useI18n } from "../../app/providers/I18nProvider";

import ConeVisualization from "./components/ConeVisualization";
import "./ConePage.scss";

export default function ConePage() {
  const { language, t } = useI18n();

  const [radius, setRadius] = useState("2");
  const [height, setHeight] = useState("5");

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const radiusValue = Number(radius);
  const heightValue = Number(height);

  const isValid =
    radius.trim() !== "" &&
    height.trim() !== "" &&
    Number.isFinite(radiusValue) &&
    Number.isFinite(heightValue) &&
    radiusValue > 0 &&
    heightValue > 0;

  const results = useMemo(() => {
    if (!isValid) return null;

    try {
      return calculateCone({
        radius: radiusValue,
        height: heightValue,
      });
    } catch {
      return null;
    }
  }, [radiusValue, heightValue, isValid]);

  const formatNumber = (value: number) =>
    new Intl.NumberFormat(language === "ru" ? "ru-RU" : "en-US", {
      maximumFractionDigits: 2,
    }).format(value);

  async function handleSave() {
    if (!results || !isValid || saving) return;

    setSaving(true);
    setSaveMessage("");

    try {
      await saveCalculation(
        "CONE",
        {
          radius: radiusValue,
          height: heightValue,
        },
        {
          volume: results.volume,
          surfaceArea: results.surfaceArea,
          slantHeight: results.slantHeight,
        }
      );

      setSaveMessage(t("savedSuccessfully"));
    } catch {
      setSaveMessage(t("saveError"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="cone-page">
      <div className="cone-page__heading">
        <h1>{t("coneTitle")}</h1>

        <p>{t("coneSubtitle")}</p>
      </div>

      <div className="cone-page__main">
        <section className="cone-card cone-card--inputs">
          <h2>{t("coneParameters")}</h2>

          <div className="cone-field">
            <label htmlFor="cone-radius">
              {t("baseRadius")} (r)
            </label>

            <input
              id="cone-radius"
              type="number"
              min="0"
              step="0.1"
              value={radius}
              onChange={(event) => {
                setRadius(event.target.value);
                setSaveMessage("");
              }}
              placeholder={t("enterRadius")}
            />
          </div>

          <div className="cone-field">
            <label htmlFor="cone-height">
              {t("height")} (h)
            </label>

            <input
              id="cone-height"
              type="number"
              min="0"
              step="0.1"
              value={height}
              onChange={(event) => {
                setHeight(event.target.value);
                setSaveMessage("");
              }}
              placeholder={t("enterHeight")}
            />
          </div>

          {!isValid && (
            <p className="cone-error" role="alert">
              {t("invalidCone")}
            </p>
          )}
        </section>

        <section className="cone-card cone-card--visual">
          <h2>{t("coneVisualization")}</h2>

          {results && (
            <ConeVisualization
              radius={results.radius}
              height={results.height}
            />
          )}
        </section>
      </div>

      <section className="cone-results">
        <h2>{t("coneResults")}</h2>

        {results ? (
          <>
            <div className="cone-results__grid">
              <article className="cone-result-card">
                <span className="cone-result-card__label">
                  {t("coneVolume")}
                </span>

                <strong className="cone-result-card__value">
                  {formatNumber(results.volume)}
                </strong>

                <div className="cone-result-card__formula">
                  <strong>V = ⅓πr²h</strong>

                  <span>
                    {`V = ⅓ × π × ${formatNumber(radiusValue)}² × ${formatNumber(heightValue)}`}
                  </span>

                  <span>
                    {`V = ${formatNumber(results.volume)}`}
                  </span>
                </div>
              </article>

              <article className="cone-result-card">
                <span className="cone-result-card__label">
                  {t("totalSurfaceArea")}
                </span>

                <strong className="cone-result-card__value">
                  {formatNumber(results.surfaceArea)}
                </strong>

                <div className="cone-result-card__formula">
                  <strong>S = πr(r + l)</strong>

                  <span>
                    {`${t("slantHeight")}: l = √(r² + h²) = ${formatNumber(results.slantHeight)}`}
                  </span>

                  <span>
                    {`S = π × ${formatNumber(radiusValue)} × (${formatNumber(radiusValue)} + ${formatNumber(results.slantHeight)})`}
                  </span>

                  <span>
                    {`S = ${formatNumber(results.surfaceArea)}`}
                  </span>
                </div>
              </article>
            </div>

            <div style={{ marginTop: "20px" }}>
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={saving}
                style={{
                  padding: "12px 20px",
                  border: "none",
                  borderRadius: "10px",
                  background: "var(--accent)",
                  color: "#fff",
                  font: "inherit",
                  fontWeight: 700,
                  cursor: saving ? "wait" : "pointer",
                  opacity: saving ? 0.65 : 1,
                }}
              >
                {saving ? t("saving") : t("saveToHistory")}
              </button>

              {saveMessage && (
                <p role="status" style={{ marginTop: "10px" }}>
                  {saveMessage}
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="cone-results__empty">
            {t("coneEmptyResults")}
          </div>
        )}
      </section>
    </main>
  );
}
