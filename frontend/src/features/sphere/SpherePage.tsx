
import { useMemo, useState } from "react";
import { calculateSphere } from "../../domain/geometry/sphere/sphere";
import SphereVisualization from "./components/SphereVisualization";
import { useI18n } from "../../app/providers/I18nProvider";
import { saveCalculation } from "../../shared/api/history";
import "./SpherePage.scss";

export default function SpherePage() {
  const { language } = useI18n();
  const isRu = language === "ru";

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

    try {
      return calculateSphere({
        radius: numericRadius,
      });
    } catch {
      return null;
    }
  }, [numericRadius, isValid]);

  const formatNumber = (value: number) =>
    new Intl.NumberFormat(isRu ? "ru-RU" : "en-US", {
      maximumFractionDigits: 2,
    }).format(value);

  const formatFormulaNumber = (value: number) =>
    Number(value.toFixed(2)).toString();

  async function handleSave() {
    if (!results || saving) return;

    setSaving(true);
    setSaveMessage("");
    setSaveError(false);

    try {
      await saveCalculation(
        "SPHERE",
        {
          radius: results.radius,
        },
        {
          surfaceArea: results.surfaceArea,
          volume: results.volume,
        }
      );

      setSaveMessage(
        isRu
          ? "Вычисление успешно сохранено в истории!"
          : "Calculation successfully saved to history!"
      );
    } catch {
      setSaveError(true);
      setSaveMessage(
        isRu
          ? "Не удалось сохранить вычисление. Проверьте подключение к серверу."
          : "Could not save the calculation. Check the server connection."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="sphere-page">
      <header className="sphere-page__header">
        <h1>{isRu ? "Сфера" : "Sphere"}</h1>

        <p>
          {isRu
            ? "Калькулятор площади поверхности и объёма сферы"
            : "Sphere surface area and volume calculator"}
        </p>
      </header>

      <section className="sphere-page__top">
        <div className="sphere-card sphere-inputs">
          <h2>
            {isRu ? "Параметры сферы" : "Sphere parameters"}
          </h2>

          <div className="sphere-inputs__field">
            <label htmlFor="sphere-radius">
              {isRu ? "Радиус сферы (R)" : "Sphere radius (R)"}
            </label>

            <div className="sphere-inputs__control">
              <input
                id="sphere-radius"
                type="number"
                min="0"
                step="any"
                value={radius}
                onChange={(event) => {
                  setRadius(event.target.value);
                  setSaveMessage("");
                }}
                placeholder={isRu ? "Введите радиус" : "Enter radius"}
              />

              <span>R</span>
            </div>

            {!isValid && (
              <p className="sphere-inputs__error" role="alert">
                {isRu
                  ? "Введите положительное число."
                  : "Enter a positive number."}
              </p>
            )}
          </div>

          <div className="sphere-inputs__formula">
            <span>
              {isRu ? "Площадь поверхности" : "Surface area"}
            </span>
            <strong>S = 4πR²</strong>
          </div>

          <div className="sphere-inputs__formula">
            <span>{isRu ? "Объём" : "Volume"}</span>
            <strong>V = 4/3πR³</strong>
          </div>
        </div>

        <div className="sphere-card sphere-card--visual">
          <div className="sphere-card__heading">
            <h2>{isRu ? "3D-модель сферы" : "3D sphere model"}</h2>
            <span className="sphere-card__tag">3D</span>
          </div>

          {results && (
            <SphereVisualization radius={results.radius} />
          )}
        </div>
      </section>

      <section className="sphere-results">
        <h2 className="sphere-results__title">
          {isRu ? "Результаты вычислений" : "Calculation results"}
        </h2>

        {results ? (
          <>
            <div className="sphere-results__grid">
              <article className="sphere-result-card">
                <span className="sphere-result-card__label">
                  {isRu
                    ? "Площадь поверхности"
                    : "Surface area"}
                </span>

                <strong className="sphere-result-card__value">
                  {formatNumber(results.surfaceArea)}
                </strong>

                <div className="sphere-result-card__details">
                  <p>
                    <b>{isRu ? "Формула:" : "Formula:"}</b>{" "}
                    S = 4πR²
                  </p>

                  <p>
                    <b>{isRu ? "Подстановка:" : "Substitution:"}</b>{" "}
                    S = 4 × π × {formatFormulaNumber(results.radius)}²
                  </p>

                  <p>
                    <b>{isRu ? "Решение:" : "Solution:"}</b>{" "}
                    S = 4 × π ×{" "}
                    {formatFormulaNumber(results.radius ** 2)}
                  </p>

                  <p>
                    S = {formatFormulaNumber(results.surfaceArea)}
                  </p>
                </div>
              </article>

              <article className="sphere-result-card">
                <span className="sphere-result-card__label">
                  {isRu ? "Объём сферы" : "Sphere volume"}
                </span>

                <strong className="sphere-result-card__value">
                  {formatNumber(results.volume)}
                </strong>

                <div className="sphere-result-card__details">
                  <p>
                    <b>{isRu ? "Формула:" : "Formula:"}</b>{" "}
                    V = 4/3πR³
                  </p>

                  <p>
                    <b>{isRu ? "Подстановка:" : "Substitution:"}</b>{" "}
                    V = 4/3 × π × {formatFormulaNumber(results.radius)}³
                  </p>

                  <p>
                    <b>{isRu ? "Решение:" : "Solution:"}</b>{" "}
                    V = 4/3 × π ×{" "}
                    {formatFormulaNumber(results.radius ** 3)}
                  </p>

                  <p>
                    V = {formatFormulaNumber(results.volume)}
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
                {saving
                  ? isRu ? "Сохранение..." : "Saving..."
                  : isRu ? "Сохранить в историю" : "Save to history"}
              </button>

              {saveMessage && (
                <p
                  className={`sphere-save__message ${
                    saveError ? "sphere-save__message--error" : ""
                  }`}
                  role="status"
                >
                  {saveMessage}
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="sphere-results__empty">
            {isRu
              ? "Введите корректный радиус, чтобы увидеть результаты."
              : "Enter a valid radius to see the results."}
          </div>
        )}
      </section>
    </main>
  );
}
