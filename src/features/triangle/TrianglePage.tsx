
import { useMemo, useState } from "react";
import { useI18n } from "../../app/providers/I18nProvider";
import { TriangleSvg } from "./components/TriangleSvg";
import "./TrianglePage.scss";

type TriangleMode = "sss" | "sas";

export interface TriangleResults {
  a: number;
  b: number;
  c: number;
  alpha: number;
  beta: number;
  gamma: number;
  perimeter: number;
  semiperimeter: number;
  area: number;
  heights: { a: number; b: number; c: number };
  medians: { a: number; b: number; c: number };
  bisectors: { a: number; b: number; c: number };
  incircle: {
    radius: number;
    diameter: number;
    circumference: number;
    area: number;
  };
  circumcircle: {
    radius: number;
    diameter: number;
    circumference: number;
    area: number;
  };
}

function calculateTriangle(
  mode: TriangleMode,
  a: number,
  b: number,
  c: number,
  gammaInput: number
): TriangleResults {
  const toRad = (degrees: number) => (degrees * Math.PI) / 180;
  const toDeg = (radians: number) => (radians * 180) / Math.PI;
  const clamp = (value: number) => Math.max(-1, Math.min(1, value));

  if (!Number.isFinite(a) || !Number.isFinite(b) || a <= 0 || b <= 0) {
    throw new Error("Стороны должны быть положительными числами.");
  }

  let sideC = c;
  let alpha: number;
  let beta: number;
  let gamma: number;

  if (mode === "sss") {
    if (!Number.isFinite(c) || c <= 0) {
      throw new Error("Сторона c должна быть положительным числом.");
    }

    if (a + b <= c || a + c <= b || b + c <= a) {
      throw new Error("Не выполняется неравенство треугольника.");
    }

    alpha = toDeg(
      Math.acos(clamp((b ** 2 + c ** 2 - a ** 2) / (2 * b * c)))
    );

    beta = toDeg(
      Math.acos(clamp((a ** 2 + c ** 2 - b ** 2) / (2 * a * c)))
    );

    gamma = 180 - alpha - beta;
  } else {
    if (!Number.isFinite(gammaInput) || gammaInput <= 0 || gammaInput >= 180) {
      throw new Error("Угол γ должен быть больше 0° и меньше 180°.");
    }

    gamma = gammaInput;

    sideC = Math.sqrt(
      a ** 2 + b ** 2 - 2 * a * b * Math.cos(toRad(gamma))
    );

    alpha = toDeg(
      Math.acos(clamp((b ** 2 + sideC ** 2 - a ** 2) / (2 * b * sideC)))
    );

    beta = 180 - alpha - gamma;
  }

  const perimeter = a + b + sideC;
  const semiperimeter = perimeter / 2;

  const area =
    mode === "sss"
      ? Math.sqrt(
          semiperimeter *
            (semiperimeter - a) *
            (semiperimeter - b) *
            (semiperimeter - sideC)
        )
      : (a * b * Math.sin(toRad(gamma))) / 2;

  if (!Number.isFinite(area) || area <= 0) {
    throw new Error("Не удалось вычислить площадь треугольника.");
  }

  const heights = {
    a: (2 * area) / a,
    b: (2 * area) / b,
    c: (2 * area) / sideC,
  };

  const medians = {
    a: 0.5 * Math.sqrt(2 * b ** 2 + 2 * sideC ** 2 - a ** 2),
    b: 0.5 * Math.sqrt(2 * a ** 2 + 2 * sideC ** 2 - b ** 2),
    c: 0.5 * Math.sqrt(2 * a ** 2 + 2 * b ** 2 - sideC ** 2),
  };

  const bisector = (opposite: number, side1: number, side2: number) => {
    const angle = Math.acos(
      clamp(
        (side1 ** 2 + side2 ** 2 - opposite ** 2) /
          (2 * side1 * side2)
      )
    );

    return (
      (2 * side1 * side2 * Math.cos(angle / 2)) /
      (side1 + side2)
    );
  };

  const bisectors = {
    a: bisector(a, b, sideC),
    b: bisector(b, a, sideC),
    c: bisector(sideC, a, b),
  };

  const inradius = area / semiperimeter;
  const circumradius = (a * b * sideC) / (4 * area);

  return {
    a,
    b,
    c: sideC,
    alpha,
    beta,
    gamma,
    perimeter,
    semiperimeter,
    area,
    heights,
    medians,
    bisectors,
    incircle: {
      radius: inradius,
      diameter: 2 * inradius,
      circumference: 2 * Math.PI * inradius,
      area: Math.PI * inradius ** 2,
    },
    circumcircle: {
      radius: circumradius,
      diameter: 2 * circumradius,
      circumference: 2 * Math.PI * circumradius,
      area: Math.PI * circumradius ** 2,
    },
  };
}

export function TrianglePage() {
  const { language } = useI18n();
  const isRu = language === "ru";

  const [mode, setMode] = useState<TriangleMode>("sss");
  const [a, setA] = useState("5");
  const [b, setB] = useState("6");
  const [c, setC] = useState("7");
  const [gamma, setGamma] = useState("60");

  const [showHeights, setShowHeights] = useState(false);
  const [showMedians, setShowMedians] = useState(false);
  const [showBisectors, setShowBisectors] = useState(false);
  const [showIncircle, setShowIncircle] = useState(false);
  const [showCircumcircle, setShowCircumcircle] = useState(false);

  const format = (value: number) =>
    Number(value.toFixed(3)).toString();

  const resultState = useMemo(() => {
    try {
      const result = calculateTriangle(
        mode,
        Number(a),
        Number(b),
        Number(c),
        Number(gamma)
      );

      return { result, error: "" };
    } catch (error) {
      return {
        result: null,
        error:
          error instanceof Error
            ? error.message
            : "Ошибка вычисления.",
      };
    }
  }, [mode, a, b, c, gamma]);

  const result = resultState.result;
  const error = resultState.error;

  const solutionCards = result
    ? [
        {
          title: isRu ? "Периметр" : "Perimeter",
          value: result.perimeter,
          formula: "P = a + b + c",
          steps: [
            `P = ${format(result.a)} + ${format(result.b)} + ${format(result.c)}`,
            `P = ${format(result.perimeter)}`,
          ],
        },
        {
          title: isRu ? "Полупериметр" : "Semiperimeter",
          value: result.semiperimeter,
          formula: "s = P / 2",
          steps: [
            `s = ${format(result.perimeter)} / 2`,
            `s = ${format(result.semiperimeter)}`,
          ],
        },
        {
          title: isRu ? "Площадь" : "Area",
          value: result.area,
          formula:
            mode === "sss"
              ? "A = √(s(s-a)(s-b)(s-c))"
              : "A = ab · sin(γ) / 2",
          steps:
            mode === "sss"
              ? [
                  `A = √(${format(result.semiperimeter)} · (${format(result.semiperimeter)} − ${format(result.a)}) · (${format(result.semiperimeter)} − ${format(result.b)}) · (${format(result.semiperimeter)} − ${format(result.c)}))`,
                  `A = ${format(result.area)}`,
                ]
              : [
                  `A = ${format(result.a)} · ${format(result.b)} · sin(${format(result.gamma)}°) / 2`,
                  `A = ${format(result.area)}`,
                ],
        },
        {
          title: isRu ? "Радиус вписанной окружности" : "Incircle radius",
          value: result.incircle.radius,
          formula: "r = A / s",
          steps: [
            `r = ${format(result.area)} / ${format(result.semiperimeter)}`,
            `r = ${format(result.incircle.radius)}`,
          ],
        },
        {
          title: isRu ? "Радиус описанной окружности" : "Circumcircle radius",
          value: result.circumcircle.radius,
          formula: "R = abc / 4A",
          steps: [
            `R = (${format(result.a)} · ${format(result.b)} · ${format(result.c)}) / (4 · ${format(result.area)})`,
            `R = ${format(result.circumcircle.radius)}`,
          ],
        },
      ]
    : [];

  const detailGroups = result
    ? [
        {
          title: isRu ? "Углы треугольника" : "Triangle angles",
          formula: "α + β + γ = 180°",
          rows: [
            {
              name: "α",
              value: result.alpha,
              formula: `α = arccos((b² + c² − a²) / 2bc) = ${format(result.alpha)}°`,
            },
            {
              name: "β",
              value: result.beta,
              formula: `β = arccos((a² + c² − b²) / 2ac) = ${format(result.beta)}°`,
            },
            {
              name: "γ",
              value: result.gamma,
              formula:
                mode === "sss"
                  ? `γ = 180° − ${format(result.alpha)}° − ${format(result.beta)}° = ${format(result.gamma)}°`
                  : `γ = ${format(result.gamma)}° (заданный угол)`,
            },
          ],
        },
        {
          title: isRu ? "Высоты" : "Heights",
          formula: "h = 2A / сторона",
          rows: [
            {
              name: "hₐ",
              value: result.heights.a,
              formula: `hₐ = 2 · ${format(result.area)} / ${format(result.a)} = ${format(result.heights.a)}`,
            },
            {
              name: "hᵦ",
              value: result.heights.b,
              formula: `hᵦ = 2 · ${format(result.area)} / ${format(result.b)} = ${format(result.heights.b)}`,
            },
            {
              name: "h꜀",
              value: result.heights.c,
              formula: `h꜀ = 2 · ${format(result.area)} / ${format(result.c)} = ${format(result.heights.c)}`,
            },
          ],
        },
        {
          title: isRu ? "Медианы" : "Medians",
          formula: "mₐ = ½√(2b² + 2c² − a²)",
          rows: [
            {
              name: "mₐ",
              value: result.medians.a,
              formula: `mₐ = ½√(2·${format(result.b)}² + 2·${format(result.c)}² − ${format(result.a)}²) = ${format(result.medians.a)}`,
            },
            {
              name: "mᵦ",
              value: result.medians.b,
              formula: `mᵦ = ½√(2·${format(result.a)}² + 2·${format(result.c)}² − ${format(result.b)}²) = ${format(result.medians.b)}`,
            },
            {
              name: "m꜀",
              value: result.medians.c,
              formula: `m꜀ = ½√(2·${format(result.a)}² + 2·${format(result.b)}² − ${format(result.c)}²) = ${format(result.medians.c)}`,
            },
          ],
        },
        {
          title: isRu ? "Биссектрисы" : "Angle bisectors",
          formula: "lₐ = 2bc · cos(α/2) / (b+c)",
          rows: [
            {
              name: "lₐ",
              value: result.bisectors.a,
              formula: `lₐ = 2·${format(result.b)}·${format(result.c)}·cos(${format(result.alpha)}°/2) / (${format(result.b)}+${format(result.c)}) = ${format(result.bisectors.a)}`,
            },
            {
              name: "lᵦ",
              value: result.bisectors.b,
              formula: `lᵦ = 2·${format(result.a)}·${format(result.c)}·cos(${format(result.beta)}°/2) / (${format(result.a)}+${format(result.c)}) = ${format(result.bisectors.b)}`,
            },
            {
              name: "l꜀",
              value: result.bisectors.c,
              formula: `l꜀ = 2·${format(result.a)}·${format(result.b)}·cos(${format(result.gamma)}°/2) / (${format(result.a)}+${format(result.b)}) = ${format(result.bisectors.c)}`,
            },
          ],
        },
      ]
    : [];

  const circleGroups = result
    ? [
        {
          title: isRu ? "Вписанная окружность" : "Incircle",
          rows: [
            {
              name: "Радиус r",
              value: result.incircle.radius,
              formula: `r = A / s = ${format(result.area)} / ${format(result.semiperimeter)} = ${format(result.incircle.radius)}`,
            },
            {
              name: "Диаметр d",
              value: result.incircle.diameter,
              formula: `d = 2r = 2 · ${format(result.incircle.radius)} = ${format(result.incircle.diameter)}`,
            },
            {
              name: "Длина C",
              value: result.incircle.circumference,
              formula: `C = 2πr = ${format(result.incircle.circumference)}`,
            },
            {
              name: "Площадь A",
              value: result.incircle.area,
              formula: `A = πr² = ${format(result.incircle.area)}`,
            },
          ],
        },
        {
          title: isRu ? "Описанная окружность" : "Circumcircle",
          rows: [
            {
              name: "Радиус R",
              value: result.circumcircle.radius,
              formula: `R = abc / 4A = ${format(result.circumcircle.radius)}`,
            },
            {
              name: "Диаметр d",
              value: result.circumcircle.diameter,
              formula: `d = 2R = ${format(result.circumcircle.diameter)}`,
            },
            {
              name: "Длина C",
              value: result.circumcircle.circumference,
              formula: `C = 2πR = ${format(result.circumcircle.circumference)}`,
            },
            {
              name: "Площадь A",
              value: result.circumcircle.area,
              formula: `A = πR² = ${format(result.circumcircle.area)}`,
            },
          ],
        },
      ]
    : [];

  return (
    <section className="triangle-page">
      <div className="triangle-heading">
        <span className="triangle-eyebrow">
          {isRu ? "Геометрия · 2D" : "Geometry · 2D"}
        </span>
        <h1>{isRu ? "Калькулятор треугольника" : "Triangle Calculator"}</h1>
        <p>
          {isRu
            ? "Рассчитайте параметры треугольника и изучите подробное решение."
            : "Calculate triangle properties and explore the step-by-step solution."}
        </p>
      </div>

      <div className="triangle-workspace">
        <div className="triangle-panel triangle-input-panel">
          <h2>{isRu ? "Параметры" : "Parameters"}</h2>

          <div className="triangle-mode-switch">
            <button
              type="button"
              className={mode === "sss" ? "active" : ""}
              onClick={() => setMode("sss")}
            >
              SSS
            </button>
            <button
              type="button"
              className={mode === "sas" ? "active" : ""}
              onClick={() => setMode("sas")}
            >
              SAS
            </button>
          </div>

          <p className="triangle-mode-description">
            {mode === "sss"
              ? isRu
                ? "Три известные стороны"
                : "Three known sides"
              : isRu
                ? "Две стороны и угол между ними"
                : "Two sides and the included angle"}
          </p>

          <label className="triangle-field">
            <span>{isRu ? "Сторона a" : "Side a"}</span>
            <input
              type="number"
              min="0"
              step="any"
              value={a}
              onChange={(event) => setA(event.target.value)}
            />
          </label>

          <label className="triangle-field">
            <span>{isRu ? "Сторона b" : "Side b"}</span>
            <input
              type="number"
              min="0"
              step="any"
              value={b}
              onChange={(event) => setB(event.target.value)}
            />
          </label>

          {mode === "sss" ? (
            <label className="triangle-field">
              <span>{isRu ? "Сторона c" : "Side c"}</span>
              <input
                type="number"
                min="0"
                step="any"
                value={c}
                onChange={(event) => setC(event.target.value)}
              />
            </label>
          ) : (
            <label className="triangle-field">
              <span>{isRu ? "Угол γ (градусы)" : "Angle γ (degrees)"}</span>
              <input
                type="number"
                min="0"
                max="180"
                step="any"
                value={gamma}
                onChange={(event) => setGamma(event.target.value)}
              />
            </label>
          )}

          <p className="triangle-live-note">
            {isRu
              ? "Результаты обновляются автоматически."
              : "Results update automatically."}
          </p>

          {error && <p className="triangle-error">{error}</p>}
        </div>

        <div className="triangle-panel triangle-visual-panel">
          <h2>{isRu ? "Визуализация" : "Visualization"}</h2>

          {result ? (
            <TriangleSvg
              triangle={result}
              showHeights={showHeights}
              showMedians={showMedians}
              showBisectors={showBisectors}
              showIncircle={showIncircle}
              showCircumcircle={showCircumcircle}
            />
          ) : (
            <div className="triangle-empty">
              {isRu
                ? "Проверьте введённые параметры треугольника."
                : "Please check the triangle parameters."}
            </div>
          )}

          <div className="triangle-toggles">
            <label>
              <input
                type="checkbox"
                checked={showHeights}
                onChange={(event) => setShowHeights(event.target.checked)}
                disabled={!result}
              />
              {isRu ? "Высоты" : "Heights"}
            </label>
            <label>
              <input
                type="checkbox"
                checked={showMedians}
                onChange={(event) => setShowMedians(event.target.checked)}
                disabled={!result}
              />
              {isRu ? "Медианы" : "Medians"}
            </label>
            <label>
              <input
                type="checkbox"
                checked={showBisectors}
                onChange={(event) => setShowBisectors(event.target.checked)}
                disabled={!result}
              />
              {isRu ? "Биссектрисы" : "Bisectors"}
            </label>
            <label>
              <input
                type="checkbox"
                checked={showIncircle}
                onChange={(event) => setShowIncircle(event.target.checked)}
                disabled={!result}
              />
              {isRu ? "Вписанная окружность" : "Incircle"}
            </label>
            <label>
              <input
                type="checkbox"
                checked={showCircumcircle}
                onChange={(event) => setShowCircumcircle(event.target.checked)}
                disabled={!result}
              />
              {isRu ? "Описанная окружность" : "Circumcircle"}
            </label>
          </div>
        </div>
      </div>

      {result && (
        <section className="triangle-results">
          <h2>{isRu ? "Результаты и ход решения" : "Results and solutions"}</h2>

          <div className="triangle-results-grid">
            {solutionCards.map((card) => (
              <article className="triangle-result-card" key={card.title}>
                <h3>{card.title}</h3>
                <strong>{format(card.value)}</strong>
                <div className="triangle-formula">{card.formula}</div>
                <div className="triangle-solution">
                  <b>{isRu ? "Решение" : "Solution"}</b>
                  {card.steps.map((step) => (
                    <p key={step}>{step}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <h2>{isRu ? "Дополнительные вычисления" : "Additional calculations"}</h2>

          <div className="triangle-details-grid">
            {detailGroups.map((group) => (
              <article className="triangle-panel" key={group.title}>
                <h3>{group.title}</h3>
                <div className="triangle-formula">{group.formula}</div>
                {group.rows.map((row) => (
                  <div className="triangle-detail-row" key={row.name}>
                    <strong>
                      {row.name} = {format(row.value)}
                    </strong>
                    <p>{row.formula}</p>
                  </div>
                ))}
              </article>
            ))}
          </div>

          <h2>{isRu ? "Параметры окружностей" : "Circle properties"}</h2>

          <div className="triangle-results-grid">
            {circleGroups.map((group) => (
              <article className="triangle-result-card" key={group.title}>
                <h3>{group.title}</h3>
                {group.rows.map((row) => (
                  <div className="triangle-detail-row" key={row.name}>
                    <strong>
                      {row.name}: {format(row.value)}
                    </strong>
                    <p>{row.formula}</p>
                  </div>
                ))}
              </article>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
