
import { useState } from "react";
import { useI18n } from "../../app/providers/I18nProvider";
import {
  translations,
  type TranslationKey,
} from "../../shared/config/i18n";
import { saveCalculation } from "../../shared/api/history";
import "./QuizPage.scss";

type QuizOption = {
  id: string;
  label: TranslationKey;
};

type QuizQuestion = {
  id: number;
  question: TranslationKey;
  options: QuizOption[];
  correct: string;
  explanation: TranslationKey;
};

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "quizQuestion1",
    options: [
      { id: "a", label: "quizQuestion1OptionA" },
      { id: "b", label: "quizQuestion1OptionB" },
      { id: "c", label: "quizQuestion1OptionC" },
      { id: "d", label: "quizQuestion1OptionD" },
    ],
    correct: "c",
    explanation: "quizExplanation1",
  },
  {
    id: 2,
    question: "quizQuestion2",
    options: [
      { id: "a", label: "quizQuestion2OptionA" },
      { id: "b", label: "quizQuestion2OptionB" },
      { id: "c", label: "quizQuestion2OptionC" },
      { id: "d", label: "quizQuestion2OptionD" },
    ],
    correct: "b",
    explanation: "quizExplanation2",
  },
  {
    id: 3,
    question: "quizQuestion3",
    options: [
      { id: "a", label: "quizQuestion3OptionA" },
      { id: "b", label: "quizQuestion3OptionB" },
      { id: "c", label: "quizQuestion3OptionC" },
      { id: "d", label: "quizQuestion3OptionD" },
    ],
    correct: "a",
    explanation: "quizExplanation3",
  },
  {
    id: 4,
    question: "quizQuestion4",
    options: [
      { id: "a", label: "quizQuestion4OptionA" },
      { id: "b", label: "quizQuestion4OptionB" },
      { id: "c", label: "quizQuestion4OptionC" },
      { id: "d", label: "quizQuestion4OptionD" },
    ],
    correct: "d",
    explanation: "quizExplanation4",
  },
  {
    id: 5,
    question: "quizQuestion5",
    options: [
      { id: "a", label: "quizQuestion5OptionA" },
      { id: "b", label: "quizQuestion5OptionB" },
      { id: "c", label: "quizQuestion5OptionC" },
      { id: "d", label: "quizQuestion5OptionD" },
    ],
    correct: "b",
    explanation: "quizExplanation5",
  },
  {
    id: 6,
    question: "quizQuestion6",
    options: [
      { id: "a", label: "quizQuestion6OptionA" },
      { id: "b", label: "quizQuestion6OptionB" },
      { id: "c", label: "quizQuestion6OptionC" },
      { id: "d", label: "quizQuestion6OptionD" },
    ],
    correct: "a",
    explanation: "quizExplanation6",
  },
  {
    id: 7,
    question: "quizQuestion7",
    options: [
      { id: "a", label: "quizQuestion7OptionA" },
      { id: "b", label: "quizQuestion7OptionB" },
      { id: "c", label: "quizQuestion7OptionC" },
      { id: "d", label: "quizQuestion7OptionD" },
    ],
    correct: "b",
    explanation: "quizExplanation7",
  },
  {
    id: 8,
    question: "quizQuestion8",
    options: [
      { id: "a", label: "quizQuestion8OptionA" },
      { id: "b", label: "quizQuestion8OptionB" },
      { id: "c", label: "quizQuestion8OptionC" },
      { id: "d", label: "quizQuestion8OptionD" },
    ],
    correct: "a",
    explanation: "quizExplanation8",
  },
  {
    id: 9,
    question: "quizQuestion9",
    options: [
      { id: "a", label: "quizQuestion9OptionA" },
      { id: "b", label: "quizQuestion9OptionB" },
      { id: "c", label: "quizQuestion9OptionC" },
      { id: "d", label: "quizQuestion9OptionD" },
    ],
    correct: "d",
    explanation: "quizExplanation9",
  },
  {
    id: 10,
    question: "quizQuestion10",
    options: [
      { id: "a", label: "quizQuestion10OptionA" },
      { id: "b", label: "quizQuestion10OptionB" },
      { id: "c", label: "quizQuestion10OptionC" },
      { id: "d", label: "quizQuestion10OptionD" },
    ],
    correct: "c",
    explanation: "quizExplanation10",
  },
];

export default function QuizPage() {
  const { t } = useI18n();

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const score = questions.reduce(
    (total, question) =>
      total + (answers[question.id] === question.correct ? 1 : 0),
    0,
  );

  const answeredCount = Object.keys(answers).length;
  const percentage = Math.round((score / questions.length) * 100);

  const handleSubmit = async () => {
    if (
      answeredCount !== questions.length ||
      submitted ||
      isSaving
    ) {
      return;
    }

    setIsSaving(true);
    setSaveError("");

    const savedAnswers = Object.fromEntries(
      questions.map((question) => {
        const selectedId = answers[question.id];

        const selectedOption = question.options.find(
          (option) => option.id === selectedId,
        );

        const correctOption = question.options.find(
          (option) => option.id === question.correct,
        );

        return [
          `question${question.id}`,
          {
            questionRu: translations.ru[question.question],
            questionEn: translations.en[question.question],

            selectedAnswerRu: selectedOption
              ? translations.ru[selectedOption.label]
              : "",
            selectedAnswerEn: selectedOption
              ? translations.en[selectedOption.label]
              : "",

            correctAnswerRu: correctOption
              ? translations.ru[correctOption.label]
              : "",
            correctAnswerEn: correctOption
              ? translations.en[correctOption.label]
              : "",

            isCorrect: selectedId === question.correct,
          },
        ];
      }),
    );

    try {
      await saveCalculation(
        "QUIZ",
        {
          questionCount: questions.length,
          answers: savedAnswers,
        },
        {
          score,
          total: questions.length,
          percentage,
          correctAnswers: score,
          incorrectAnswers: questions.length - score,
        },
      );

      setSubmitted(true);
    } catch (error) {
      console.error("Quiz history save failed:", error);
      setSaveError(t("quizSaveError"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setSubmitted(false);
    setSaveError("");
  };

  return (
    <main className="quiz-page">
      <header className="quiz-page__header">
        <span className="quiz-page__eyebrow">
          {t("quizEyebrow")}
        </span>

        <h1>{t("quizTitle")}</h1>

        <p>{t("quizSubtitle")}</p>
      </header>

      <section
        className="quiz-progress"
        aria-label={t("quizProgressLabel")}
      >
        <div className="quiz-progress__info">
          <span>{t("quizAnswered")}</span>
          <strong>
            {answeredCount} / {questions.length}
          </strong>
        </div>

        <div className="quiz-progress__track">
          <div
            className="quiz-progress__value"
            style={{
              width: `${(answeredCount / questions.length) * 100}%`,
            }}
          />
        </div>
      </section>

      {submitted && (
        <section className="quiz-score" aria-live="polite">
          <div className="quiz-score__icon">
            {percentage >= 80
              ? "★"
              : percentage >= 50
                ? "✓"
                : "↗"}
          </div>

          <div className="quiz-score__content">
            <span>{t("quizYourResult")}</span>

            <strong>
              {score} / {questions.length}
            </strong>

            <p>
              {t("quizCorrectPercentage")}: {percentage}%
            </p>
          </div>
        </section>
      )}

      <div className="quiz-questions">
        {questions.map((question) => {
          const selected = answers[question.id];
          const isCorrect = selected === question.correct;

          return (
            <article
              className={`quiz-question ${
                submitted
                  ? isCorrect
                    ? "quiz-question--correct"
                    : "quiz-question--incorrect"
                  : ""
              }`}
              key={question.id}
            >
              <div className="quiz-question__heading">
                <span className="quiz-question__number">
                  {String(question.id).padStart(2, "0")}
                </span>

                <h2>{t(question.question)}</h2>
              </div>

              <div className="quiz-question__options">
                {question.options.map((option) => {
                  const isSelected = selected === option.id;
                  const isRight = option.id === question.correct;

                  return (
                    <label
                      key={option.id}
                      className={[
                        "quiz-option",
                        isSelected ? "quiz-option--selected" : "",
                        submitted && isRight
                          ? "quiz-option--correct"
                          : "",
                        submitted && isSelected && !isRight
                          ? "quiz-option--incorrect"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option.id}
                        checked={isSelected}
                        disabled={submitted}
                        onChange={() =>
                          setAnswers((previous) => ({
                            ...previous,
                            [question.id]: option.id,
                          }))
                        }
                      />

                      <span className="quiz-option__marker">
                        {option.id.toUpperCase()}
                      </span>

                      <span className="quiz-option__text">
                        {t(option.label)}
                      </span>

                      {submitted && isRight && (
                        <span className="quiz-option__status">
                          ✓
                        </span>
                      )}

                      {submitted && isSelected && !isRight && (
                        <span className="quiz-option__status">
                          ×
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>

              {submitted && (
                <div className="quiz-explanation">
                  <strong>{t("quizExplanationTitle")}</strong>
                  <p>{t(question.explanation)}</p>
                </div>
              )}
            </article>
          );
        })}
      </div>

      <footer className="quiz-actions">
        {!submitted ? (
          <>
            {answeredCount < questions.length && (
              <p className="quiz-actions__hint">
                {t("quizRemaining")}:{" "}
                {questions.length - answeredCount}
              </p>
            )}

            {saveError && (
              <p className="quiz-actions__hint" role="alert">
                {saveError}
              </p>
            )}

            <button
              className="quiz-button"
              type="button"
              onClick={handleSubmit}
              disabled={
                answeredCount !== questions.length || isSaving
              }
            >
              {isSaving
                ? t("quizSaving")
                : t("quizSubmit")}
            </button>
          </>
        ) : (
          <button
            className="quiz-button"
            type="button"
            onClick={handleRestart}
          >
            {t("quizRestart")}
          </button>
        )}
      </footer>
    </main>
  );
}
