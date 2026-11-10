
import { useMemo, useState } from "react";

import { calculateCircle } from "../../domain/geometry/circle/circle";
import { saveCalculation } from "../../shared/api/history";
import { CircleCanvas } from "./components/CircleCanvas";
import "./CirclePage.scss";

import { useI18n } from "../../app/providers/I18nProvider";

export function CirclePage() {
  const { language } = useI18n();
  const isRu = language === "ru";

  const [radius, setRadius] = useState("50");
  const [angle, setAngle] = useState("90");

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const numericRadius = Number(radius);
  const numericAngle = Number(angle);

  const isValid =
    radius.trim() !== "" &&
    angle.trim() !== "" &&
    Number.isFinite(numericRadius) &&
    numericRadius > 0 &&
    Number.isFinite(numericAngle) &&
    numericAngle >= 0 &&
    numericAngle <= 360;

  const results = useMemo(() => {
    if (!isValid) return null;

    return calculateCircle({
      radius: numericRadius,
      angle: numericAngle,
    });
  }, [isValid, numericRadius, numericAngle]);

  const format = (value: number) => value.toFixed(2);

  async function handleSave() {
    if (!results || !isValid || saving) return;

    setSaving(true);
    setSaveMessage("");

    try {
      await saveCalculation(
        "CIRCLE",
        {
          radius: numericRadius,
          angle: numericAngle,
        },
        {
          diameter: results.diameter,
          circumference: results.circumference,
          area: results.area,
          arcLength: results.arcLength,
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
    <section className="circle-page">
      <header className="circle-page__header">
        <h1>{isRu ? "Калькулятор круга" : "Circle Calculator"}</h1>
        <p>
          {isRu
            ? "Измени параметры и наблюдай, как меняется круг."
            : "Change the parameters and see how the circle changes."}
        </p>
      </header>

      <div className="circle-page__top">
        <div className="circle-card circle-inputs">
          <h2>{isRu ? "Исходные данные" : "Input values"}</h2>

          <label htmlFor="circle-radius">
            {isRu ? "Радиус (r)" : "Radius (r)"}
          </label>

          <input
            id="circle-radius"
            type="number"
            min="0.01"
            step="any"
            value={radius}
            onChange={(event) => {
              setRadius(event.target.value);
              setSaveMessage("");
            }}
          />

          <label htmlFor="circle-angle">
            {isRu ? "Угол сектора (°)" : "Sector angle (°)"}
          </label>

          <input
            id="circle-angle"
            type="number"
            min="0"
            max="360"
            step="any"
            value={angle}
            onChange={(event) => {
              setAngle(event.target.value);
              setSaveMessage("");
            }}
          />

          {!isValid && (
            <p className="circle-error" role="alert">
              {isRu
                ? "Укажи радиус больше 0 и угол от 0° до 360°."
                : "Enter a radius greater than 0 and an angle from 0° to 360°."}
            </p>
          )}
        </div>

        <div className="circle-card circle-card--visual">
          <h2>{isRu ? "Визуализация" : "Visualization"}</h2>

          {isValid ? (
            <CircleCanvas
              radius={numericRadius}
              angle={numericAngle}
            />
          ) : (
            <p className="circle-error">
              {isRu
                ? "Исправь исходные данные для отображения круга."
                : "Correct the input values to display the circle."}
            </p>
          )}
        </div>
      </div>

      {results && (
        <section className="circle-results">
          <h2>{isRu ? "Результаты и решение" : "Results and solutions"}</h2>

          <div className="circle-results__grid">
            <article className="circle-result-card">
              <span className="circle-result-card__label">
                {isRu ? "Диаметр" : "Diameter"}
              </span>

              <strong className="circle-result-card__value">
                {format(results.diameter)}
              </strong>

              <div className="circle-result-card__solution">
                <span>{isRu ? "Формула" : "Formula"}</span>
                <p>d = 2r</p>

                <span>{isRu ? "Решение" : "Solution"}</span>
                <p>
                  d = 2 × {numericRadius} ={" "}
                  <strong>{format(results.diameter)}</strong>
                </p>
              </div>
            </article>

            <article className="circle-result-card">
              <span className="circle-result-card__label">
                {isRu ? "Длина окружности" : "Circumference"}
              </span>

              <strong className="circle-result-card__value">
                {format(results.circumference)}
              </strong>

              <div className="circle-result-card__solution">
                <span>{isRu ? "Формула" : "Formula"}</span>
                <p>C = 2πr</p>

                <span>{isRu ? "Решение" : "Solution"}</span>
                <p>
                  C = 2 × π × {numericRadius} ≈{" "}
                  <strong>{format(results.circumference)}</strong>
                </p>
              </div>
            </article>

            <article className="circle-result-card">
              <span className="circle-result-card__label">
                {isRu ? "Площадь круга" : "Circle area"}
              </span>

              <strong className="circle-result-card__value">
                {format(results.area)}
              </strong>

              <div className="circle-card__solution">
                <span>{isRu ? "Формула" : "Formula"}</span>
                <p>A = πr²</p>

                <span>{isRu ? "Решение" : "Solution"}</span>
                <p>
                  A = π × {numericRadius}² ≈{" "}
                  <strong>{format(results.area)}</strong>
                </p>
              </div>
            </article>

            <article className="circle-result-card">
              <span className="circle-result-card__label">
                {isRu ? "Длина дуги" : "Arc length"}
              </span>

              <strong className="circle-result-card__value">
                {format(results.arcLength)}
              </strong>

              <div className="circle-result-card__solution">
                <span>{isRu ? "Формула" : "Formula"}</span>
                <p>L = 2πr × α / 360°</p>

                <span>{isRu ? "Решение" : "Solution"}</span>
                <p>
                  L = 2 × π × {numericRadius} × {numericAngle} / 360 ≈{" "}
                  <strong>{format(results.arcLength)}</strong>
                </p>
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
        </section>
      )}
    </section>
  );
}
