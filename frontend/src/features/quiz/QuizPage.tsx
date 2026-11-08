import { useState } from "react";
import { useI18n } from "../../app/providers/I18nProvider";
import "./QuizPage.scss";

type QuizOption = {
  id: string;
  ru: string;
  en: string;
};

type QuizQuestion = {
  id: number;
  ru: string;
  en: string;
  options: QuizOption[];
  correct: string;
  explanationRu: string;
  explanationEn: string;
};

const questions: QuizQuestion[] = [
  {
    id: 1,
    ru: "Раздел евклидовой геометрии, в котором изучаются фигуры в пространстве.",
    en: "The branch of Euclidean geometry that studies shapes in space.",
    options: [
      { id: "a", ru: "Аналитическая геометрия", en: "Analytical geometry" },
      { id: "b", ru: "Многомерная геометрия", en: "Multidimensional geometry" },
      { id: "c", ru: "Стереометрия", en: "Stereometry" },
      { id: "d", ru: "Дифференциальная геометрия", en: "Differential geometry" },
    ],
    correct: "c",
    explanationRu:
      "Стереометрия — раздел евклидовой геометрии, изучающий пространственные фигуры: многогранники, цилиндры, конусы, шары и другие тела.",
    explanationEn:
      "Stereometry is the branch of Euclidean geometry that studies solid figures in space, such as polyhedra, cylinders, cones and spheres.",
  },
  {
    id: 2,
    ru: "Раздел математики, изучающий общие приёмы действий над величинами, независимо от их числовых значений.",
    en: "The branch of mathematics that studies general methods of operations on quantities, regardless of their numerical values.",
    options: [
      { id: "a", ru: "Планиметрия", en: "Planimetry" },
      { id: "b", ru: "Алгебра", en: "Algebra" },
      { id: "c", ru: "Матрица", en: "Matrix" },
      { id: "d", ru: "Тригонометрия", en: "Trigonometry" },
    ],
    correct: "b",
    explanationRu:
      "Алгебра изучает общие правила работы с числами, переменными и выражениями. В отличие от обычных вычислений с конкретными числами, она позволяет записывать и исследовать общие зависимости.",
    explanationEn:
      "Algebra studies general rules for working with numbers, variables and expressions. It allows us to describe and investigate relationships in a general form.",
  },
  {
    id: 3,
    ru: "Раздел евклидовой геометрии, изучающий фигуры на плоскости.",
    en: "A branch of Euclidean geometry that studies geometric figures on a plane.",
    options: [
      { id: "a", ru: "Планиметрия", en: "Planimetry" },
      { id: "b", ru: "Топология", en: "Topology" },
      { id: "c", ru: "Вектор", en: "Vector" },
      { id: "d", ru: "Дискретная математика", en: "Discrete mathematics" },
    ],
    correct: "a",
    explanationRu:
      "Планиметрия изучает геометрические фигуры на плоскости: точки, прямые, углы, треугольники, окружности и многоугольники.",
    explanationEn:
      "Planimetry studies geometric figures on a plane, including points, lines, angles, triangles, circles and polygons.",
  },
  {
    id: 4,
    ru: "Раздел математики, изучающий числа, их отношения и свойства.",
    en: "A branch of mathematics that studies numbers, their relationships, and properties.",
    options: [
      { id: "a", ru: "Тригонометрия", en: "Trigonometry" },
      { id: "b", ru: "Вычислительная математика", en: "Computational Mathematics" },
      { id: "c", ru: "Стереометрия", en: "Stereometry" },
      { id: "d", ru: "Арифметика", en: "Arithmetic" },
    ],
    correct: "d",
    explanationRu:
      "Арифметика изучает числа, их свойства и основные действия над ними: сложение, вычитание, умножение и деление.",
    explanationEn:
      "Arithmetic studies numbers, their properties and basic operations: addition, subtraction, multiplication and division.",
  },
  {
    id: 5,
    ru: "Раздел математики, изучающий доказательства и вопросы, связанные с основаниями математики.",
    en: "A branch of mathematics that studies proofs and questions related to the foundations of mathematics.",
    options: [
      { id: "a", ru: "Дедуктивная теория", en: "Deductive Theory" },
      { id: "b", ru: "Математическая логика", en: "Mathematical Logic" },
      { id: "c", ru: "Геометрия", en: "Geometry" },
      { id: "d", ru: "Теория алгоритмов", en: "Algorithm Theory" },
    ],
    correct: "b",
    explanationRu:
      "Математическая логика изучает формальные методы рассуждений, логические высказывания, доказательства и основы математических теорий.",
    explanationEn:
      "Mathematical logic studies formal reasoning, logical statements, proofs and the foundations of mathematical theories.",
  },
  {
    id: 6,
    ru: "Фигура, изучаемая в планиметрии.",
    en: "Figure studied in planimetry.",
    options: [
      { id: "a", ru: "Параллелограмм", en: "Parallelogram" },
      { id: "b", ru: "Тетраэдр", en: "Tetrahedron" },
      { id: "c", ru: "Сфера", en: "Sphere" },
      { id: "d", ru: "Куб", en: "Cube" },
    ],
    correct: "a",
    explanationRu:
      "Параллелограмм — плоский четырёхугольник, у которого противоположные стороны попарно параллельны. Поэтому его изучают в планиметрии.",
    explanationEn:
      "A parallelogram is a plane quadrilateral whose opposite sides are parallel. Therefore, it is studied in planimetry.",
  },
  {
    id: 7,
    ru: "Условие, состоящее в одновременном выполнении нескольких уравнений относительно одной или нескольких переменных.",
    en: "A condition consisting of the simultaneous satisfaction of several equations with respect to one or more variables.",
    options: [
      { id: "a", ru: "Логарифм", en: "Logarithm" },
      { id: "b", ru: "Система уравнений", en: "System of equations" },
      { id: "c", ru: "Интеграл", en: "Integral" },
      { id: "d", ru: "Модули", en: "Modules" },
    ],
    correct: "b",
    explanationRu:
      "Система уравнений — это несколько уравнений, которые должны выполняться одновременно. Её решением являются значения переменных, удовлетворяющие каждому уравнению системы.",
    explanationEn:
      "A system of equations consists of several equations that must hold simultaneously. Its solution is a set of variable values satisfying every equation in the system.",
  },
  {
    id: 8,
    ru: "Совокупность инструкций, описывающих порядок действий исполнителя для достижения результата решения задачи за конечное число действий.",
    en: "A set of instructions describing the sequence of actions for an executor to achieve the desired outcome in solving a problem in a finite number of steps.",
    options: [
      { id: "a", ru: "Алгоритм", en: "Algorithm" },
      { id: "b", ru: "Математический анализ", en: "Mathematical Analysis" },
      { id: "c", ru: "Геометрическая прогрессия", en: "Geometric Progression" },
      { id: "d", ru: "Арифметическая прогрессия", en: "Arithmetic Progression" },
    ],
    correct: "a",
    explanationRu:
      "Алгоритм — конечная последовательность понятных инструкций, выполнение которых приводит к решению задачи или получению определённого результата.",
    explanationEn:
      "An algorithm is a finite sequence of clear instructions that leads to solving a problem or obtaining a particular result.",
  },
  {
    id: 9,
    ru: "Раздел математики, изучающий закономерности случайных явлений: случайные события, случайные величины, их свойства и операции над ними.",
    en: "A branch of mathematics that studies the patterns of random phenomena: random events, random variables, their properties, and operations on them.",
    options: [
      { id: "a", ru: "Функциональный анализ", en: "Functional Analysis" },
      { id: "b", ru: "Математическая статистика", en: "Mathematical Statistics" },
      { id: "c", ru: "Теория алгоритмов", en: "Algorithm Theory" },
      { id: "d", ru: "Теория вероятностей", en: "Probability Theory" },
    ],
    correct: "d",
    explanationRu:
      "Теория вероятностей изучает случайные события и численно описывает возможность их наступления. Она также исследует случайные величины и закономерности случайных явлений.",
    explanationEn:
      "Probability theory studies random events and describes numerically how likely they are to occur. It also investigates random variables and patterns in random phenomena.",
  },
  {
    id: 10,
    ru: "Геометрическая фигура, обычно определяемая как замкнутая ломаная, имеющая больше одного угла.",
    en: "A geometric figure usually defined as a closed polygonal line that has more than one angle.",
    options: [
      { id: "a", ru: "Конус", en: "Cone" },
      { id: "b", ru: "Параллелепипед", en: "Parallelepiped" },
      { id: "c", ru: "Многоугольник", en: "Polygon" },
      { id: "d", ru: "Октаэдр", en: "Octahedron" },
    ],
    correct: "c",
    explanationRu:
      "Многоугольник — часть плоскости, ограниченная замкнутой ломаной. Его стороны образуют вершины и внутренние углы.",
    explanationEn:
      "A polygon is a portion of a plane bounded by a closed polygonal line. Its sides meet at vertices and form interior angles.",
  },
];

export default function QuizPage() {
  const { language } = useI18n();
  const isRu = language === "ru";

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = questions.reduce(
    (total, question) =>
      total + (answers[question.id] === question.correct ? 1 : 0),
    0,
  );

  const answeredCount = Object.keys(answers).length;
  const percentage = Math.round((score / questions.length) * 100);

  const handleSubmit = () => {
    if (answeredCount !== questions.length) return;
    setSubmitted(true);
  };

  const handleRestart = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <main className="quiz-page">
      <header className="quiz-page__header">
        <span className="quiz-page__eyebrow">
          {isRu ? "Проверь свои знания" : "Test your knowledge"}
        </span>
        <h1>{isRu ? "Тест знаний" : "Knowledge test"}</h1>
        <p>
          {isRu
            ? "Ответь на 10 вопросов и узнай, насколько хорошо ты знаешь основы математики."
            : "Answer 10 questions and find out how well you know the basics of mathematics."}
        </p>
      </header>

      <section className="quiz-progress" aria-label={isRu ? "Прогресс теста" : "Quiz progress"}>
        <div className="quiz-progress__info">
          <span>{isRu ? "Пройдено вопросов" : "Questions answered"}</span>
          <strong>{answeredCount} / {questions.length}</strong>
        </div>
        <div className="quiz-progress__track">
          <div
            className="quiz-progress__value"
            style={{ width: `${(answeredCount / questions.length) * 100}%` }}
          />
        </div>
      </section>

      {submitted && (
        <section className="quiz-score" aria-live="polite">
          <div className="quiz-score__icon">
            {percentage >= 80 ? "★" : percentage >= 50 ? "✓" : "↗"}
          </div>
          <div className="quiz-score__content">
            <span>{isRu ? "Твой результат" : "Your result"}</span>
            <strong>{score} / {questions.length}</strong>
            <p>
              {isRu
                ? `Правильных ответов: ${percentage}%`
                : `Correct answers: ${percentage}%`}
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
                <h2>{isRu ? question.ru : question.en}</h2>
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
                        submitted && isRight ? "quiz-option--correct" : "",
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
                        {isRu ? option.ru : option.en}
                      </span>
                      {submitted && isRight && (
                        <span className="quiz-option__status">✓</span>
                      )}
                      {submitted && isSelected && !isRight && (
                        <span className="quiz-option__status">×</span>
                      )}
                    </label>
                  );
                })}
              </div>

              {submitted && (
                <div className="quiz-explanation">
                  <strong>
                    {isRu ? "Объяснение" : "Explanation"}
                  </strong>
                  <p>
                    {isRu
                      ? question.explanationRu
                      : question.explanationEn}
                  </p>
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
                {isRu
                  ? `Осталось ответить: ${questions.length - answeredCount}`
                  : `Questions remaining: ${questions.length - answeredCount}`}
              </p>
            )}
            <button
              className="quiz-button"
              type="button"
              onClick={handleSubmit}
              disabled={answeredCount !== questions.length}
            >
              {isRu ? "Завершить тест" : "Submit answers"}
            </button>
          </>
        ) : (
          <button
            className="quiz-button"
            type="button"
            onClick={handleRestart}
          >
            {isRu ? "Пройти тест заново" : "Try again"}
          </button>
        )}
      </footer>
    </main>
  );
}