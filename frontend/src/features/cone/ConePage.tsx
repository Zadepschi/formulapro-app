
import { useMemo, useState } from "react";
import { calculateCone } from "../../domain/geometry/cone/cone";
import { saveCalculation } from "../../shared/api/history";
import ConeVisualization from "./components/ConeVisualization";
import { useI18n } from "../../app/providers/I18nProvider";
import "./ConePage.scss";

export default function ConePage() {
  const { language } = useI18n();
  const isRu = language === "ru";

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
    new Intl.NumberFormat(isRu ? "ru-RU" : "en-US", {
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

      setSaveMessage(
        isRu
          ? "Вычисление сохранено в истории!"
          : "Calculation saved to history!"
      );
    } catch {
      setSaveMessage(
        isRu
          ? "Не удалось сохранить. Проверь, запущен ли сервер."
          : "Could not save. Check whether the server is running."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="cone-page">
      <div className="cone-page__heading">
        <h1>
          {isRu
            ? "Конус — объём и площадь поверхности"
            : "Cone — Volume and Surface Area"}
        </h1>

        <p>
          {isRu
            ? "Введите радиус основания и высоту конуса."
            : "Enter the radius of the base and the height of the cone."}
        </p>
      </div>

      <div className="cone-page__main">
        <section className="cone-card cone-card--inputs">
          <h2>
            {isRu ? "Параметры конуса" : "Cone Parameters"}
          </h2>

          <div className="cone-field">
            <label htmlFor="cone-radius">
              {isRu ? "Радиус основания (r)" : "Base radius (r)"}
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
              placeholder={isRu ? "Введите радиус" : "Enter radius"}
            />
          </div>

          <div className="cone-field">
            <label htmlFor="cone-height">
              {isRu ? "Высота (h)" : "Height (h)"}
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
              placeholder={isRu ? "Введите высоту" : "Enter height"}
            />
          </div>

          {!isValid && (
            <p className="cone-error" role="alert">
              {isRu
                ? "Введите положительные значения радиуса и высоты."
                : "Enter positive values for the radius and height."}
            </p>
          )}
        </section>

        <section className="cone-card cone-card--visual">
          <h2>
            {isRu ? "3D-модель конуса" : "3D Cone Model"}
          </h2>

          {results && (
            <ConeVisualization
              radius={results.radius}
              height={results.height}
            />
          )}
        </section>
      </div>

      <section className="cone-results">
        <h2>
          {isRu ? "Результаты расчёта" : "Calculation Results"}
        </h2>

        {results ? (
          <>
            <div className="cone-results__grid">
              <article className="cone-result-card">
                <span className="cone-result-card__label">
                  {isRu ? "Объём конуса" : "Cone Volume"}
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
                  {isRu
                    ? "Полная площадь поверхности"
                    : "Total Surface Area"}
                </span>

                <strong className="cone-result-card__value">
                  {formatNumber(results.surfaceArea)}
                </strong>

                <div className="cone-result-card__formula">
                  <strong>S = πr(r + l)</strong>

                  <span>
                    {isRu
                      ? `Образующая: l = √(r² + h²) = ${formatNumber(results.slantHeight)}`
                      : `Slant height: l = √(r² + h²) = ${formatNumber(results.slantHeight)}`}
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
                {saving
                  ? isRu ? "Сохранение..." : "Saving..."
                  : isRu ? "Сохранить в историю" : "Save to history"}
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
            {isRu
              ? "Результаты появятся после ввода корректных значений."
              : "Results will appear after entering valid values."}
          </div>
        )}
      </section>
    </main>
  );
}
