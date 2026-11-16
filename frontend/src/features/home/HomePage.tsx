
import { Link, useParams } from "react-router-dom";
import { useI18n } from "../../app/providers/I18nProvider";
import "./HomePage.scss";

const figures2D = [
  { path: "circle", label: "circle", symbol: "◯" },
  { path: "triangle", label: "triangle", symbol: "△" },
  { path: "parallelogram", label: "parallelogram", symbol: "▱" },
] as const;

const figures3D = [
  { path: "sphere", label: "sphere", symbol: "◉" },
  { path: "cone", label: "cone", symbol: "△" },
  { path: "prism", label: "prism", symbol: "◇" },
] as const;

export function HomePage() {
  const { language, t } = useI18n();
  const { lang } = useParams();

  const currentLanguage = lang || language;

  return (
    <main className="premium-home">

      {/* HERO */}
      <section className="premium-hero">

        <div className="hero-copy">
          <div className="eyebrow">
            ГЕОМЕТРИЯ <span>•</span> ФОРМУЛЫ <span>•</span> РАСЧЁТЫ
          </div>

          <h1 className="premium-title">
            Formula<span>Pro</span>
          </h1>

          <p className="hero-description">
            {t("description")}
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <span>⌗</span>
              <p>Расчёты<br />онлайн</p>
            </div>

            <div className="feature-item">
              <span>▤</span>
              <p>Формулы<br />и объяснения</p>
            </div>

            <div className="feature-item">
              <span>▥</span>
              <p>Тесты<br />на знания</p>
            </div>

            <div className="feature-item">
              <span>◷</span>
              <p>История<br />геометрии</p>
            </div>
          </div>
        </div>

        {/* Геометрическая иллюстрация */}
        <div className="hero-visual" aria-hidden="true">
          <svg
            className="geometry-artwork"
            viewBox="0 0 620 450"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity=".65" />
                <stop offset="45%" stopColor="var(--text-primary)" stopOpacity=".12" />
                <stop offset="100%" stopColor="var(--text-primary)" stopOpacity=".45" />
              </linearGradient>

              <radialGradient id="sphere">
                <stop offset="0%" stopColor="var(--text-primary)" stopOpacity=".02" />
                <stop offset="80%" stopColor="var(--text-primary)" stopOpacity=".08" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity=".3" />
              </radialGradient>
            </defs>

            {/* Сетка */}
            <ellipse
              cx="310"
              cy="365"
              rx="285"
              ry="55"
              stroke="var(--text-secondary)"
              strokeOpacity=".3"
            />

            <ellipse
              cx="310"
              cy="365"
              rx="210"
              ry="38"
              stroke="var(--text-secondary)"
              strokeOpacity=".2"
            />

            <path
              d="M25 365 H595 M70 345 H550 M120 385 H500"
              stroke="var(--text-secondary)"
              strokeOpacity=".2"
            />

            {/* Сфера */}
            <circle
              cx="370"
              cy="145"
              r="105"
              fill="url(#sphere)"
              stroke="url(#glass)"
              strokeWidth="3"
            />

            <path
              d="M300 90 Q360 25 420 70"
              stroke="var(--text-primary)"
              strokeOpacity=".55"
              strokeWidth="4"
              strokeLinecap="round"
            />

            <text
              x="370"
              y="155"
              textAnchor="middle"
              fill="var(--text-primary)"
              fontSize="24"
              fontFamily="Georgia"
            >
              V = ⁴⁄₃ πr³
            </text>

            {/* Конус */}
            <path
              d="M95 340 L175 85 L260 340 Q178 370 95 340Z"
              fill="url(#glass)"
              stroke="var(--accent)"
              strokeWidth="2.5"
            />

            <ellipse
              cx="177"
              cy="340"
              rx="82"
              ry="20"
              stroke="var(--accent)"
              strokeWidth="2"
            />

            <path
              d="M175 85 L175 340"
              stroke="var(--text-primary)"
              strokeOpacity=".35"
              strokeDasharray="7 8"
            />

            <text
              x="180"
              y="255"
              textAnchor="middle"
              fill="var(--text-primary)"
              fontSize="18"
              fontFamily="Georgia"
            >
              V = ⅓πr²h
            </text>

            {/* Призма */}
            <path
              d="M415 190 L515 155 L575 190 L475 225 Z"
              fill="url(#glass)"
              stroke="var(--text-primary)"
              strokeOpacity=".65"
              strokeWidth="2"
            />

            <path
              d="M415 190 V325 L475 360 V225 M475 360 L575 325 V190"
              fill="url(#glass)"
              stroke="var(--text-primary)"
              strokeOpacity=".65"
              strokeWidth="2"
            />

            <path
              d="M475 225 L575 190 M475 360 V225"
              stroke="var(--accent)"
              strokeOpacity=".5"
              strokeWidth="2"
            />

            <text
              x="492"
              y="285"
              textAnchor="middle"
              fill="var(--text-primary)"
              fontSize="21"
              fontFamily="Georgia"
            >
              V = a³
            </text>

            {/* Передняя пирамида */}
            <path
              d="M270 365 L350 195 L440 365 Z"
              fill="url(#glass)"
              stroke="var(--text-primary)"
              strokeOpacity=".8"
              strokeWidth="2.5"
            />

            <path
              d="M350 195 L350 365"
              stroke="var(--text-primary)"
              strokeOpacity=".35"
              strokeDasharray="6 7"
            />

            {/* Золотая орбита */}
            <path
              d="M35 345 Q310 440 600 230"
              stroke="var(--accent)"
              strokeWidth="2.5"
              strokeOpacity=".8"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </section>

      {/* QUICK ACCESS */}
      <section className="premium-shortcuts">

        <div className="shortcuts-heading">
          <h2>{t("calculators")}</h2>
          <span />
        </div>

        <div className="shortcut-content">

          <div className="shortcut-group">
            <span className="dimension-badge">2D</span>

            {figures2D.map((figure) => (
              <Link
                key={figure.path}
                to={`/${currentLanguage}/${figure.path}`}
                className="shortcut-link"
              >
                <span className="shortcut-symbol">
                  {figure.symbol}
                </span>
                <span>{t(figure.label)}</span>
              </Link>
            ))}
          </div>

          <div className="shortcut-divider" />

          <div className="shortcut-group">
            <span className="dimension-badge">3D</span>

            {figures3D.map((figure) => (
              <Link
                key={figure.path}
                to={`/${currentLanguage}/${figure.path}`}
                className="shortcut-link"
              >
                <span className="shortcut-symbol">
                  {figure.symbol}
                </span>
                <span>{t(figure.label)}</span>
              </Link>
            ))}
          </div>

          <div className="extra-shortcuts">

            <Link
              to={`/${currentLanguage}/quiz`}
              className="extra-shortcut"
            >
              <span className="extra-shortcut-icon">✧</span>
              <span>
                <strong>{t("quiz")}</strong>
                <small>Проверка знаний</small>
              </span>
              <span className="shortcut-arrow">→</span>
            </Link>

            <Link
              to={`/${currentLanguage}/history`}
              className="extra-shortcut"
            >
              <span className="extra-shortcut-icon">◷</span>
              <span>
                <strong>{t("history")}</strong>
                <small>Развитие геометрии</small>
              </span>
              <span className="shortcut-arrow">→</span>
            </Link>

          </div>
        </div>
      </section>
    </main>
  );
}
