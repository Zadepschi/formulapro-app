
import { useCallback, useEffect, useState } from "react";
import { useI18n } from "../../app/providers/I18nProvider";
import {
  clearHistory,
  deleteCalculation,
  getHistory,
  type Calculation,
  type CalculatorType,
} from "../../shared/api/history";
import "./HistoryPage.scss";

type ConfirmAction =
  | { type: "single"; id: string }
  | { type: "all" };

const calculatorNames: Record<CalculatorType, { ru: string; en: string }> = {
  CIRCLE: { ru: "Круг", en: "Circle" },
  TRIANGLE: { ru: "Треугольник", en: "Triangle" },
  SPHERE: { ru: "Сфера", en: "Sphere" },
  CONE: { ru: "Конус", en: "Cone" },
  PARALLELOGRAM: { ru: "Параллелограмм", en: "Parallelogram" },
  PRISM: { ru: "Призма", en: "Prism" },
  QUIZ: { ru: "Тест", en: "Quiz" },
};

const labels: Record<string, { ru: string; en: string }> = {
  a: { ru: "Сторона a", en: "Side a" },
  b: { ru: "Сторона b", en: "Side b" },
  c: { ru: "Сторона c", en: "Side c" },
  mode: { ru: "Метод", en: "Mode" },
  gamma: { ru: "Угол γ", en: "Angle γ" },
  alpha: { ru: "Угол α", en: "Angle α" },
  beta: { ru: "Угол β", en: "Angle β" },
  angles: { ru: "Углы", en: "Angles" },
  area: { ru: "Площадь", en: "Area" },
  perimeter: { ru: "Периметр", en: "Perimeter" },
  semiperimeter: { ru: "Полупериметр", en: "Semiperimeter" },
  heights: { ru: "Высоты", en: "Heights" },
  medians: { ru: "Медианы", en: "Medians" },
  bisectors: { ru: "Биссектрисы", en: "Angle bisectors" },
  incircle: { ru: "Вписанная окружность", en: "Incircle" },
  circumcircle: { ru: "Описанная окружность", en: "Circumcircle" },
  radius: { ru: "Радиус", en: "Radius" },
  diameter: { ru: "Диаметр", en: "Diameter" },
  circumference: { ru: "Длина окружности", en: "Circumference" },
  volume: { ru: "Объём", en: "Volume" },
  surfaceArea: { ru: "Площадь поверхности", en: "Surface area" },
  length: { ru: "Длина", en: "Length" },
  width: { ru: "Ширина", en: "Width" },
  height: { ru: "Высота", en: "Height" },
    questionCount: { ru: "Количество вопросов", en: "Question count" },
  answers: { ru: "Ответы", en: "Answers" },
  question: { ru: "Вопрос", en: "Question" },
  selectedAnswer: { ru: "Твой ответ", en: "Your answer" },
  correctAnswer: { ru: "Правильный ответ", en: "Correct answer" },
  isCorrect: { ru: "Правильно", en: "Correct" },
  score: { ru: "Баллы", en: "Score" },
  total: { ru: "Всего вопросов", en: "Total questions" },
  percentage: { ru: "Результат, %", en: "Result, %" },
  correctAnswers: { ru: "Правильные ответы", en: "Correct answers" },
  incorrectAnswers: { ru: "Ошибочные ответы", en: "Incorrect answers" },
};

function formatLabel(key: string, isRussian: boolean): string {
  const known = labels[key];

  if (known) {
    return known[isRussian ? "ru" : "en"];
  }

  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (letter) => letter.toUpperCase());
}

function formatValue(value: unknown, language: string): string {
  if (typeof value === "number") {
    return new Intl.NumberFormat(
      language === "ru" ? "ru-RU" : "en-US",
      {
        maximumFractionDigits: 4,
      }
    ).format(value);
  }

  if (typeof value === "boolean") {
    return value ? "Да" : "Нет";
  }

  if (typeof value === "string") {
    if (value === "sss") {
      return language === "ru"
        ? "Три стороны (SSS)"
        : "Three sides (SSS)";
    }

    if (value === "sas") {
      return language === "ru"
        ? "Две стороны и угол (SAS)"
        : "Two sides and angle (SAS)";
    }

    return value;
  }

  if (value === null || value === undefined) {
    return "—";
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => formatValue(item, language))
      .join(", ");
  }

  return "—";
}

function HistoryValue({
  name,
  value,
  language,
  depth = 0,
}: {
  name: string;
  value: unknown;
  language: string;
  depth?: number;
}) {
  const isRussian = language === "ru";

  // Если значение является объектом,
  // выводим его вложенные свойства отдельно.
  if (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  ) {
    return (
      <div
        className={`history-nested-group${
          depth > 0 ? " is-nested" : ""
        }`}
      >
        <div className="history-nested-title">
          {formatLabel(name, isRussian)}
        </div>

        <div className="history-nested-content">
          {Object.entries(
            value as Record<string, unknown>
          ).map(([childKey, childValue]) => (
            <HistoryValue
              key={`${name}-${childKey}`}
              name={childKey}
              value={childValue}
              language={language}
              depth={depth + 1}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="history-value-row">
      <span>{formatLabel(name, isRussian)}</span>
      <strong>{formatValue(value, language)}</strong>
    </div>
  );
}

function formatDate(date: string, language: string): string {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat(
    language === "ru" ? "ru-RU" : "en-US",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(parsed);
}

export default function HistoryPage() {
  const { language } = useI18n();
  const isRussian = language === "ru";

  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  const [confirmAction, setConfirmAction] =
    useState<ConfirmAction | null>(null);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getHistory();
      setCalculations(data);
    } catch {
      setError(
        isRussian
          ? "Не удалось загрузить историю. Проверьте, запущен ли сервер."
          : "Could not load history. Check whether the server is running."
      );
    } finally {
      setLoading(false);
    }
  }, [isRussian]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    if (!confirmAction) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setConfirmAction(null);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [confirmAction]);

  async function handleDelete(id: string) {
    setBusyId(id);
    setError("");

    try {
      await deleteCalculation(id);

      setCalculations((current) =>
        current.filter((item) => item.id !== id)
      );
    } catch {
      setError(
        isRussian
          ? "Не удалось удалить вычисление."
          : "Could not delete the calculation."
      );
    } finally {
      setBusyId(null);
    }
  }

  async function handleClear() {
    if (calculations.length === 0) return;

    setClearing(true);
    setError("");

    try {
      await clearHistory();
      setCalculations([]);
    } catch {
      setError(
        isRussian
          ? "Не удалось очистить историю."
          : "Could not clear history."
      );
    } finally {
      setClearing(false);
    }
  }

  async function handleConfirmAction() {
    const action = confirmAction;

    if (!action || busyId !== null || clearing) return;

    setConfirmAction(null);

    if (action.type === "single") {
      await handleDelete(action.id);
    } else {
      await handleClear();
    }
  }

  return (
    <div className="history-page">
      <section className="history-heading">
        <div>
          <span className="history-label">FORMULAPRO</span>

          <h1>
            {isRussian
              ? "История вычислений"
              : "Calculation history"}
          </h1>

          <p>
            {isRussian
              ? "Все ваши сохранённые геометрические вычисления в одном месте."
              : "All your saved geometry calculations in one place."}
          </p>
        </div>

        <div className="history-count">
          <span>{calculations.length}</span>
          <small>
            {isRussian ? "записей" : "records"}
          </small>
        </div>
      </section>

      {error && (
        <div className="history-error" role="alert">
          {error}

          <button
            type="button"
            onClick={() => void loadHistory()}
          >
            {isRussian ? "Повторить" : "Retry"}
          </button>
        </div>
      )}

      <section className="history-section">
        <div className="history-toolbar">
          <h2>
            {isRussian
              ? "Ваши вычисления"
              : "Your calculations"}
          </h2>

          <button
            type="button"
            className="history-clear-button"
            onClick={() =>
              setConfirmAction({ type: "all" })
            }
            disabled={
              calculations.length === 0 ||
              clearing ||
              loading ||
              busyId !== null
            }
          >
            {clearing
              ? isRussian
                ? "Очистка..."
                : "Clearing..."
              : isRussian
                ? "Очистить историю"
                : "Clear history"}
          </button>
        </div>

        {loading ? (
          <div className="history-state">
            {isRussian
              ? "Загрузка истории..."
              : "Loading history..."}
          </div>
        ) : calculations.length === 0 ? (
          <div className="history-empty">
            <span className="history-empty-icon">◷</span>

            <h3>
              {isRussian
                ? "История пока пуста"
                : "Your history is empty"}
            </h3>

            <p>
              {isRussian
                ? "Выполните вычисление в одном из калькуляторов, и оно появится здесь."
                : "Complete a calculation in one of the calculators, and it will appear here."}
            </p>
          </div>
        ) : (
          <div className="history-list">
            {calculations.map((calculation) => (
              <article
                className="history-card"
                key={calculation.id}
              >
                <div className="history-card-top">
                  <div>
                    <span className="history-calculator">
                      {calculatorNames[
                        calculation.calculator
                      ]?.[isRussian ? "ru" : "en"] ??
                        calculation.calculator}
                    </span>

                    <time dateTime={calculation.createdAt}>
                      {formatDate(
                        calculation.createdAt,
                        language
                      )}
                    </time>
                  </div>

                  <button
                    type="button"
                    className="history-delete-button"
                    onClick={() =>
                      setConfirmAction({
                        type: "single",
                        id: calculation.id,
                      })
                    }
                    disabled={
                      busyId !== null ||
                      clearing ||
                      loading
                    }
                    aria-label={
                      isRussian
                        ? "Удалить вычисление"
                        : "Delete calculation"
                    }
                  >
                    {isRussian ? "Удалить" : "Delete"}
                  </button>
                </div>

                <div className="history-data-grid">
                  <div className="history-data-block">
                    <h3>
                      {isRussian
                        ? "Исходные данные"
                        : "Inputs"}
                    </h3>

                    <div className="history-values">
                      {Object.entries(
                        calculation.inputs ?? {}
                      ).map(([key, value]) => (
                        <HistoryValue
                          key={key}
                          name={key}
                          value={value}
                          language={language}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="history-data-block history-results">
                    <h3>
                      {isRussian
                        ? "Результаты"
                        : "Results"}
                    </h3>

                    <div className="history-values">
                      {Object.entries(
                        calculation.results ?? {}
                      ).map(([key, value]) => (
                        <HistoryValue
                          key={key}
                          name={key}
                          value={value}
                          language={language}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {confirmAction && (
        <div
          className="history-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setConfirmAction(null);
            }
          }}
        >
          <div
            className="history-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="history-modal-title"
            aria-describedby="history-modal-description"
          >
            <div className="history-modal-icon">
              <span>⌫</span>
            </div>

            <h2 id="history-modal-title">
              {confirmAction.type === "all"
                ? isRussian
                  ? "Очистить всю историю?"
                  : "Clear all history?"
                : isRussian
                  ? "Удалить вычисление?"
                  : "Delete calculation?"}
            </h2>

            <p id="history-modal-description">
              {confirmAction.type === "all"
                ? isRussian
                  ? "Все сохранённые вычисления будут удалены. Это действие нельзя отменить."
                  : "All saved calculations will be deleted. This action cannot be undone."
                : isRussian
                  ? "Это вычисление будет удалено из истории. Восстановить его будет нельзя."
                  : "This calculation will be removed from history and cannot be restored."}
            </p>

            <div className="history-modal-actions">
              <button
                type="button"
                className="history-modal-cancel"
                onClick={() => setConfirmAction(null)}
              >
                {isRussian ? "Отмена" : "Cancel"}
              </button>

              <button
                type="button"
                className="history-modal-confirm"
                onClick={() => void handleConfirmAction()}
                disabled={busyId !== null || clearing}
              >
                {isRussian ? "Удалить" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
