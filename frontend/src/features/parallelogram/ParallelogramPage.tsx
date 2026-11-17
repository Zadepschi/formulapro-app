
import { useMemo, useState } from "react";

import { calculateParallelogram } from "../../domain/geometry/parallelogram/parallelogram";
import { ParallelogramSvg } from "./components/ParallelogramSvg";
import { useI18n } from "../../app/providers/I18nProvider";
import { saveCalculation } from "../../shared/api/history";
import "./ParallelogramPage.scss";

export function ParallelogramPage() {
  const { t } = useI18n();

  const [a, setA] = useState("10");
  const [b, setB] = useState("6");
  const [h, setH] = useState("4");

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState(false);

  const numericA = Number(a);
  const numericB = Number(b);
  const numericH = Number(h);

  const isValid =
    a.trim() !== "" &&
    b.trim() !== "" &&
    h.trim() !== "" &&
    Number.isFinite(numericA) &&
    numericA > 0 &&
    Number.isFinite(numericB) &&
    numericB > 0 &&
    Number.isFinite(numericH) &&
    numericH > 0 &&
    numericH <= numericB;

  const results = useMemo(() => {
    if (!isValid) return null;

    return calculateParallelogram({
      a: numericA,
      b: numericB,
      h: numericH,
    });
  }, [isValid, numericA, numericB, numericH]);

  const format = (value: number) =>
    Number(value.toFixed(2)).toString();

  function updateInput(
    setter: (value: string) => void,
    value: string
  ) {
    setter(value);
    setSaveMessage("");
    setSaveError(false);
  }

  async function handleSave() {
    if (!results || saving) return;

    setSaving(true);
    setSaveMessage("");
    setSaveError(false);

    try {
      await saveCalculation(
        "PARALLELOGRAM",
        {
          a: numericA,
          b: numericB,
          h: numericH,
        },
        {
          perimeter: results.perimeter,
          area: results.area,
        }
      );

      setSaveMessage(t("savedSuccessfully"));
    } catch {
      setSaveError(true);
      setSaveMessage(t("parallelogramSaveError"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="parallelogram-page">
      <header className="parallelogram-page__header">
        <h1>{t("parallelogramTitle")}</h1>

        <p>{t("parallelogramSubtitle")}</p>
      </header>

      <div className="parallelogram-page__top">
        <div className="parallelogram-card parallelogram-inputs">
          <h2>{t("inputValues")}</h2>

          <label htmlFor="parallelogram-a">
            {t("base")} (a)
          </label>

          <input
            id="parallelogram-a"
            type="number"
            min="0.01"
            step="any"
            value={a}
            onChange={(event) =>
              updateInput(setA, event.target.value)
            }
          />

          <label htmlFor="parallelogram-b">
            {t("side")} (b)
          </label>

          <input
            id="parallelogram-b"
            type="number"
            min="0.01"
            step="any"
            value={b}
            onChange={(event) =>
              updateInput(setB, event.target.value)
            }
          />

          <label htmlFor="parallelogram-h">
            {t("heightToBase")} (h)
          </label>

          <input
            id="parallelogram-h"
            type="number"
            min="0.01"
            step="any"
            value={h}
            onChange={(event) =>
              updateInput(setH, event.target.value)
            }
          />

          {!isValid && (
            <p className="parallelogram-error" role="alert">
              {t("invalidParallelogram")}
            </p>
          )}
        </div>

        <div className="parallelogram-card parallelogram-card--visual">
          <h2>{t("visualization")}</h2>

          {isValid ? (
            <ParallelogramSvg
              a={numericA}
              b={numericB}
              h={numericH}
            />
          ) : (
            <p className="parallelogram-error">
              {t("correctParallelogram")}
            </p>
          )}
        </div>
      </div>

      {results && (
        <section className="parallelogram-results">
          <h2>{t("resultsAndSolution")}</h2>

          <div className="parallelogram-results__grid">
            <article className="parallelogram-result-card">
              <span className="parallelogram-result-card__label">
                {t("perimeter")}
              </span>

              <strong className="parallelogram-result-card__value">
                {format(results.perimeter)}
              </strong>

              <div className="parallelogram-result-card__solution">
                <span>{t("formula")}</span>
                <p>P = 2(a + b)</p>

                <span>{t("solution")}</span>
                <p>
                  P = 2 × ({numericA} + {numericB})
                </p>
                <p>
                  P = 2 × {format(numericA + numericB)}
                </p>
                <p>
                  P = <strong>{format(results.perimeter)}</strong>
                </p>
              </div>
            </article>

            <article className="parallelogram-result-card">
              <span className="parallelogram-result-card__label">
                {t("area")}
              </span>

              <strong className="parallelogram-result-card__value">
                {format(results.area)}
              </strong>

              <div className="parallelogram-result-card__solution">
                <span>{t("formula")}</span>
                <p>S = a × h</p>

                <span>{t("solution")}</span>
                <p>
                  S = {numericA} × {numericH}
                </p>
                <p>
                  S = <strong>{format(results.area)}</strong>
                </p>
              </div>
            </article>
          </div>

          <div className="parallelogram-save">
            <button
              type="button"
              className="parallelogram-save__button"
              onClick={() => void handleSave()}
              disabled={saving}
            >
              {saving ? t("saving") : t("saveToHistory")}
            </button>

            {saveMessage && (
              <p
                className={`parallelogram-save__message ${
                  saveError
                    ? "parallelogram-save__message--error"
                    : ""
                }`}
                role="status"
              >
                {saveMessage}
              </p>
            )}
          </div>
        </section>
      )}
    </section>
  );
}
