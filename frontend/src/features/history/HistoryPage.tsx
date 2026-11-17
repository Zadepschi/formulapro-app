
import { useCallback, useEffect, useState } from "react";
import { useI18n } from "../../app/providers/I18nProvider";
import type { TranslationKey } from "../../shared/config/i18n";
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

type Translate = (key: TranslationKey) => string;

const calculatorNames: Record<CalculatorType, TranslationKey> = {
  CIRCLE: "historyCalculatorCircle",
  TRIANGLE: "historyCalculatorTriangle",
  SPHERE: "historyCalculatorSphere",
  CONE: "historyCalculatorCone",
  PARALLELOGRAM: "historyCalculatorParallelogram",
  PRISM: "historyCalculatorPrism",
  QUIZ: "historyCalculatorQuiz",
};

const labels: Record<string, TranslationKey> = {
  a: "historyLabelSideA",
  b: "historyLabelSideB",
  c: "historyLabelSideC",
  mode: "historyLabelMode",
  gamma: "historyLabelGamma",
  alpha: "historyLabelAlpha",
  beta: "historyLabelBeta",
  angles: "historyLabelAngles",
  area: "historyLabelArea",
  perimeter: "historyLabelPerimeter",
  semiperimeter: "historyLabelSemiperimeter",
  heights: "historyLabelHeights",
  medians: "historyLabelMedians",
  bisectors: "historyLabelBisectors",
  incircle: "historyLabelIncircle",
  circumcircle: "historyLabelCircumcircle",
  radius: "historyLabelRadius",
  angle: "historyLabelAngle",
  diameter: "historyLabelDiameter",
  circumference: "historyLabelCircumference",
  arcLength: "historyLabelArcLength",
  volume: "historyLabelVolume",
  surfaceArea: "historyLabelSurfaceArea",
  slantHeight: "historyLabelSlantHeight",
  length: "historyLabelLength",
  width: "historyLabelWidth",
  height: "historyLabelHeight",
  questionCount: "historyLabelQuestionCount",
  answers: "historyLabelAnswers",
  question: "historyLabelQuestion",
  selectedAnswer: "historyLabelSelectedAnswer",
  correctAnswer: "historyLabelCorrectAnswer",
  isCorrect: "historyLabelIsCorrect",
  score: "historyLabelScore",
  total: "historyLabelTotal",
  percentage: "historyLabelPercentage",
  correctAnswers: "historyLabelCorrectAnswers",
  incorrectAnswers: "historyLabelIncorrectAnswers",
};

function formatLabel(key: string, t: Translate): string {
  const translationKey = labels[key];

  if (translationKey) {
    return t(translationKey);
  }

  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (letter) => letter.toUpperCase());
}

function formatValue(
  value: unknown,
  language: string,
  t: Translate,
): string {
  if (typeof value === "number") {
    return new Intl.NumberFormat(
      language === "ru" ? "ru-RU" : "en-US",
      { maximumFractionDigits: 4 },
    ).format(value);
  }

  if (typeof value === "boolean") {
    return value ? t("historyYes") : t("historyNo");
  }

  if (typeof value === "string") {
    if (value === "sss") {
      return t("historyModeSSS");
    }

    if (value === "sas") {
      return t("historyModeSAS");
    }

    return value;
  }

  if (value === null || value === undefined) {
    return "—";
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => formatValue(item, language, t))
      .join(", ");
  }

  return "—";
}

function HistoryValue({
  name,
  value,
  language,
  t,
  depth = 0,
}: {
  name: string;
  value: unknown;
  language: string;
  t: Translate;
  depth?: number;
}) {
  // Специальное отображение ответов теста
  if (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    "questionRu" in value &&
    "questionEn" in value
  ) {
    const answer = value as Record<string, unknown>;
    const questionKey =
      language === "ru" ? "questionRu" : "questionEn";
    const correctKey =
      language === "ru" ? "correctAnswerRu" : "correctAnswerEn";
    const selectedKey =
      language === "ru" ? "selectedAnswerRu" : "selectedAnswerEn";

    return (
      <div className="history-nested-group is-nested">
        <div className="history-nested-title">
          {t("historyQuestionNumber")} {name.replace("question", "")}
        </div>

        <div className="history-nested-content">
          <div className="history-value-row">
            <span>{t("historyLabelQuestion")}</span>
            <strong>{String(answer[questionKey] ?? "—")}</strong>
          </div>

          <div className="history-value-row">
            <span>{t("historyLabelIsCorrect")}</span>
            <strong>
              {answer.isCorrect ? t("historyYes") : t("historyNo")}
            </strong>
          </div>

          <div className="history-value-row">
            <span>{t("historyLabelCorrectAnswer")}</span>
            <strong>{String(answer[correctKey] ?? "—")}</strong>
          </div>

          <div className="history-value-row">
            <span>{t("historyLabelSelectedAnswer")}</span>
            <strong>{String(answer[selectedKey] ?? "—")}</strong>
          </div>
        </div>
      </div>
    );
  }

  // Отображение вложенных объектов
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
          {formatLabel(name, t)}
        </div>

        <div className="history-nested-content">
          {Object.entries(value as Record<string, unknown>).map(
            ([childKey, childValue]) => (
              <HistoryValue
                key={`${name}-${childKey}`}
                name={childKey}
                value={childValue}
                language={language}
                t={t}
                depth={depth + 1}
              />
            ),
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="history-value-row">
      <span>{formatLabel(name, t)}</span>
      <strong>{formatValue(value, language, t)}</strong>
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
    },
  ).format(parsed);
}

export default function HistoryPage() {
  const { language, t } = useI18n();

  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<TranslationKey | "">("");
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
      setError("historyLoadError");
    } finally {
      setLoading(false);
    }
  }, []);

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
        current.filter((item) => item.id !== id),
      );
    } catch {
      setError("historyDeleteError");
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
      setError("historyClearError");
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
        <div className="history-heading__content">
          <div className="history-label">
            <span className="history-label__dot" />
            FORMULAPRO
            <span className="history-label__line" />
            {t("historyEyebrow")}
          </div>

          <h1>
            {t("historyTitleFirst")}{" "}
            <span>{t("historyTitleSecond")}</span>
          </h1>

          <p>{t("historySubtitle")}</p>
        </div>

        <div className="history-count">
          <div className="history-count__icon">◷</div>
          <span>{calculations.length}</span>
          <small>{t("historySavedRecords")}</small>
        </div>
      </section>

      {error && (
        <div className="history-error" role="alert">
          {t(error)}

          <button
            type="button"
            onClick={() => void loadHistory()}
          >
            {t("historyRetry")}
          </button>
        </div>
      )}

      <section className="history-section">
        <div className="history-toolbar">
          <h2>{t("historyCalculations")}</h2>

          <button
            type="button"
            className="history-clear-button"
            onClick={() => setConfirmAction({ type: "all" })}
            disabled={
              calculations.length === 0 ||
              clearing ||
              loading ||
              busyId !== null
            }
          >
            {clearing
              ? t("historyClearing")
              : t("historyClear")}
          </button>
        </div>

        {loading ? (
          <div className="history-state">
            {t("historyLoading")}
          </div>
        ) : calculations.length === 0 ? (
          <div className="history-empty">
            <span className="history-empty-icon">◷</span>

            <h3>{t("historyEmptyTitle")}</h3>

            <p>{t("historyEmptyDescription")}</p>
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
                      {calculatorNames[calculation.calculator]
                        ? t(calculatorNames[calculation.calculator])
                        : calculation.calculator}
                    </span>

                    <time dateTime={calculation.createdAt}>
                      {formatDate(calculation.createdAt, language)}
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
                    aria-label={t("historyDelete")}
                  >
                    {t("historyDelete")}
                  </button>
                </div>

                <div className="history-data-grid">
                  <div className="history-data-block">
                    <h3>{t("historyInputs")}</h3>

                    <div className="history-values">
                      {Object.entries(calculation.inputs ?? {}).map(
                        ([key, value]) => (
                          <HistoryValue
                            key={key}
                            name={key}
                            value={value}
                            language={language}
                            t={t}
                          />
                        ),
                      )}
                    </div>
                  </div>

                  <div className="history-data-block history-results">
                    <h3>{t("historyResults")}</h3>

                    <div className="history-values">
                      {Object.entries(calculation.results ?? {}).map(
                        ([key, value]) => (
                          <HistoryValue
                            key={key}
                            name={key}
                            value={value}
                            language={language}
                            t={t}
                          />
                        ),
                      )}
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
                ? t("historyConfirmClearTitle")
                : t("historyConfirmDeleteTitle")}
            </h2>

            <p id="history-modal-description">
              {confirmAction.type === "all"
                ? t("historyConfirmClearDescription")
                : t("historyConfirmDeleteDescription")}
            </p>

            <div className="history-modal-actions">
              <button
                type="button"
                className="history-modal-cancel"
                onClick={() => setConfirmAction(null)}
              >
                {t("historyCancel")}
              </button>

              <button
                type="button"
                className="history-modal-confirm"
                onClick={() => void handleConfirmAction()}
                disabled={busyId !== null || clearing}
              >
                {t("historyDelete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
