import { useMemo, useState } from "react";
import { calculatePrism } from "../../domain/geometry/prism/prism";
import PrismVisualization from "./components/PrismVisualization";
import { useI18n } from "../../app/providers/I18nProvider";
import "./PrismPage.scss";

export default function PrismPage() {
  const { language } = useI18n();
  const isRu = language === "ru";

  const [length, setLength] = useState("3");
  const [width, setWidth] = useState("2");
  const [height, setHeight] = useState("1");

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
  }, [
    lengthValue,
    widthValue,
    heightValue,
    isValid,
  ]);

  const formatNumber = (value: number) =>
    new Intl.NumberFormat(isRu ? "ru-RU" : "en-US", {
      maximumFractionDigits: 2,
    }).format(value);

  return (
    <main className="prism-page">
      <div className="prism-page__heading">
        <h1>
          {isRu
            ? "Прямоугольный параллелепипед — объём и площадь поверхности"
            : "Rectangular Prism — Volume and Surface Area"}
        </h1>

        <p>
          {isRu
            ? "Введите длину, ширину и высоту параллелепипеда."
            : "Enter the length, width and height of the prism."}
        </p>
      </div>

      <div className="prism-page__main">
        <section className="prism-card prism-card--inputs">
          <h2>
            {isRu
              ? "Параметры параллелепипеда"
              : "Prism Parameters"}
          </h2>

          <div className="prism-field">
            <label htmlFor="prism-length">
              {isRu ? "Длина (a)" : "Length (a)"}
            </label>

            <input
              id="prism-length"
              type="number"
              min="0"
              step="0.1"
              value={length}
              onChange={(event) =>
                setLength(event.target.value)
              }
              placeholder={isRu ? "Введите длину" : "Enter length"}
            />
          </div>

          <div className="prism-field">
            <label htmlFor="prism-width">
              {isRu ? "Ширина (b)" : "Width (b)"}
            </label>

            <input
              id="prism-width"
              type="number"
              min="0"
              step="0.1"
              value={width}
              onChange={(event) =>
                setWidth(event.target.value)
              }
              placeholder={isRu ? "Введите ширину" : "Enter width"}
            />
          </div>

          <div className="prism-field">
            <label htmlFor="prism-height">
              {isRu ? "Высота (h)" : "Height (h)"}
            </label>

            <input
              id="prism-height"
              type="number"
              min="0"
              step="0.1"
              value={height}
              onChange={(event) =>
                setHeight(event.target.value)
              }
              placeholder={isRu ? "Введите высоту" : "Enter height"}
            />
          </div>

          {!isValid && (
            <p className="prism-error" role="alert">
              {isRu
                ? "Введите положительные значения всех трёх параметров."
                : "Enter positive values for all three parameters."}
            </p>
          )}
        </section>

        <section className="prism-card prism-card--visual">
          <h2>
            {isRu
              ? "3D-модель параллелепипеда"
              : "3D Rectangular Prism Model"}
          </h2>

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
        <h2>
          {isRu ? "Результаты расчёта" : "Calculation Results"}
        </h2>

        {results ? (
          <div className="prism-results__grid">
            <article className="prism-result-card">
              <span className="prism-result-card__label">
                {isRu
                  ? "Объём параллелепипеда"
                  : "Prism Volume"}
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
                {isRu
                  ? "Полная площадь поверхности"
                  : "Total Surface Area"}
              </span>

              <strong className="prism-result-card__value">
                {formatNumber(results.surfaceArea)}
              </strong>

              <div className="prism-result-card__formula">
                <strong>
                  S = 2(ab + ah + bh)
                </strong>

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
            {isRu
              ? "Результаты появятся после ввода корректных значений."
              : "Results will appear after entering valid values."}
          </div>
        )}
      </section>
    </main>
  );
}