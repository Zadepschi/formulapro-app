
import type { TriangleResults } from "../TrianglePage";

interface TriangleSvgProps {
  triangle: TriangleResults;
  showHeights: boolean;
  showMedians: boolean;
  showBisectors: boolean;
  showIncircle: boolean;
  showCircumcircle: boolean;
}

type Point = {
  x: number;
  y: number;
};

const midpoint = (p1: Point, p2: Point): Point => ({
  x: (p1.x + p2.x) / 2,
  y: (p1.y + p2.y) / 2,
});

const project = (point: Point, start: Point, end: Point): Point => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;

  const t =
    ((point.x - start.x) * dx + (point.y - start.y) * dy) /
    lengthSquared;

  return {
    x: start.x + t * dx,
    y: start.y + t * dy,
  };
};

const bisectorPoint = (
  p1: Point,
  p2: Point,
  weight1: number,
  weight2: number
): Point => ({
  x: (weight2 * p1.x + weight1 * p2.x) / (weight1 + weight2),
  y: (weight2 * p1.y + weight1 * p2.y) / (weight1 + weight2),
});

export function TriangleSvg({
  triangle,
  showHeights,
  showMedians,
  showBisectors,
  showIncircle,
  showCircumcircle,
}: TriangleSvgProps) {
  const { a, b, c, area, perimeter, gamma } = triangle;

  // Координаты вершин.
  // Стороны a, b, c лежат напротив углов A, B, C соответственно.
  const A: Point = { x: 0, y: 0 };
  const B: Point = { x: c, y: 0 };

  const cx = (b * b + c * c - a * a) / (2 * c);
  const cy = -Math.sqrt(Math.max(0, b * b - cx * cx));

  const C: Point = { x: cx, y: cy };

  // Центр вписанной окружности.
  const incenter: Point = {
    x: (a * A.x + b * B.x + c * C.x) / perimeter,
    y: (a * A.y + b * B.y + c * C.y) / perimeter,
  };

  const inradius = (2 * area) / perimeter;

  // Центр описанной окружности.
  const denominator =
    2 *
    (A.x * (B.y - C.y) +
      B.x * (C.y - A.y) +
      C.x * (A.y - B.y));

  const circumcenter: Point = {
    x:
      ((A.x ** 2 + A.y ** 2) * (B.y - C.y) +
        (B.x ** 2 + B.y ** 2) * (C.y - A.y) +
        (C.x ** 2 + C.y ** 2) * (A.y - B.y)) /
      denominator,
    y:
      ((A.x ** 2 + A.y ** 2) * (C.x - B.x) +
        (B.x ** 2 + B.y ** 2) * (A.x - C.x) +
        (C.x ** 2 + C.y ** 2) * (B.x - A.x)) /
      denominator,
  };

  const circumradius = Math.hypot(
    A.x - circumcenter.x,
    A.y - circumcenter.y
  );

  // Медианы.
  const medianA = midpoint(B, C);
  const medianB = midpoint(A, C);
  const medianC = midpoint(A, B);

  // Высоты.
  const heightA = project(A, B, C);
  const heightB = project(B, A, C);
  const heightC = project(C, A, B);

  // Биссектрисы.
  const bisectorA = bisectorPoint(B, C, b, c);
  const bisectorB = bisectorPoint(A, C, a, c);
  const bisectorC = bisectorPoint(A, B, a, b);

  // Границы чертежа.
  const points: Point[] = [A, B, C];

  if (showHeights) {
    points.push(heightA, heightB, heightC);
  }

  let minX = Math.min(...points.map((p) => p.x));
  let maxX = Math.max(...points.map((p) => p.x));
  let minY = Math.min(...points.map((p) => p.y));
  let maxY = Math.max(...points.map((p) => p.y));

  if (showCircumcircle) {
    minX = Math.min(minX, circumcenter.x - circumradius);
    maxX = Math.max(maxX, circumcenter.x + circumradius);
    minY = Math.min(minY, circumcenter.y - circumradius);
    maxY = Math.max(maxY, circumcenter.y + circumradius);
  }

  if (showIncircle) {
    minX = Math.min(minX, incenter.x - inradius);
    maxX = Math.max(maxX, incenter.x + inradius);
    minY = Math.min(minY, incenter.y - inradius);
    maxY = Math.max(maxY, incenter.y + inradius);
  }

  // Масштабирование всего чертежа.
  const viewWidth = 440;
  const viewHeight = 360;
  const padding = 48;

  const contentWidth = Math.max(maxX - minX, 0.001);
  const contentHeight = Math.max(maxY - minY, 0.001);

  const scale = Math.min(
    (viewWidth - padding * 2) / contentWidth,
    (viewHeight - padding * 2) / contentHeight
  );

  const offsetX =
    (viewWidth - contentWidth * scale) / 2 - minX * scale;

  const offsetY =
    (viewHeight - contentHeight * scale) / 2 - minY * scale;

  const transform = (point: Point): Point => ({
    x: point.x * scale + offsetX,
    y: point.y * scale + offsetY,
  });

  const pA = transform(A);
  const pB = transform(B);
  const pC = transform(C);

  const pIncenter = transform(incenter);
  const pCircumcenter = transform(circumcenter);

  const pMedianA = transform(medianA);
  const pMedianB = transform(medianB);
  const pMedianC = transform(medianC);

  const pHeightA = transform(heightA);
  const pHeightB = transform(heightB);
  const pHeightC = transform(heightC);

  const pBisectorA = transform(bisectorA);
  const pBisectorB = transform(bisectorB);
  const pBisectorC = transform(bisectorC);

  // Дуга угла gamma в вершине C.
  const angleRadius = 25;

  const angleStart = Math.atan2(
    pA.y - pC.y,
    pA.x - pC.x
  );

  const angleEnd = Math.atan2(
    pB.y - pC.y,
    pB.x - pC.x
  );

  let angleDelta = angleEnd - angleStart;

  // Выбираем меньшую дугу — внутренний угол треугольника.
  while (angleDelta > Math.PI) {
    angleDelta -= 2 * Math.PI;
  }

  while (angleDelta < -Math.PI) {
    angleDelta += 2 * Math.PI;
  }

  const arcStart = {
    x: pC.x + angleRadius * Math.cos(angleStart),
    y: pC.y + angleRadius * Math.sin(angleStart),
  };

  const arcEnd = {
    x: pC.x + angleRadius * Math.cos(angleStart + angleDelta),
    y: pC.y + angleRadius * Math.sin(angleStart + angleDelta),
  };

  const arcMiddleAngle = angleStart + angleDelta / 2;

  const angleLabelPosition = {
    x: pC.x + (angleRadius + 18) * Math.cos(arcMiddleAngle),
    y: pC.y + (angleRadius + 18) * Math.sin(arcMiddleAngle),
  };

  const angleArcPath = `
    M ${arcStart.x} ${arcStart.y}
    A ${angleRadius} ${angleRadius}
    0 0 ${angleDelta >= 0 ? 1 : 0}
    ${arcEnd.x} ${arcEnd.y}
  `;

  return (
    <div className="triangle-svg-wrapper">
      <svg
        className="triangle-svg"
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`Triangle diagram, angle gamma ${gamma.toFixed(1)} degrees`}
      >
        {/* Описанная окружность */}
        {showCircumcircle && (
          <circle
            cx={pCircumcenter.x}
            cy={pCircumcenter.y}
            r={circumradius * scale}
            className="triangle-circumcircle"
          />
        )}

        {/* Вписанная окружность */}
        {showIncircle && (
          <circle
            cx={pIncenter.x}
            cy={pIncenter.y}
            r={inradius * scale}
            className="triangle-incircle"
          />
        )}

   {/* Сначала заливаем сам треугольник */}
<polygon
  points={`${pA.x},${pA.y} ${pB.x},${pB.y} ${pC.x},${pC.y}`}
  className="triangle-shape"
/>

{/* Затем описанная и вписанная окружности */}
{showCircumcircle && (
  <circle
    cx={pCircumcenter.x}
    cy={pCircumcenter.y}
    r={circumradius * scale}
    className="triangle-circumcircle"
  />
)}

{showIncircle && (
  <circle
    cx={pIncenter.x}
    cy={pIncenter.y}
    r={inradius * scale}
    className="triangle-incircle"
  />
)}

{/* Медианы */}
{showMedians && (
  <g className="triangle-medians">
    <line x1={pA.x} y1={pA.y} x2={pMedianA.x} y2={pMedianA.y} />
    <line x1={pB.x} y1={pB.y} x2={pMedianB.x} y2={pMedianB.y} />
    <line x1={pC.x} y1={pC.y} x2={pMedianC.x} y2={pMedianC.y} />
  </g>
)}

{/* Высоты */}
{showHeights && (
  <g className="triangle-heights">
    <line x1={pA.x} y1={pA.y} x2={pHeightA.x} y2={pHeightA.y} />
    <line x1={pB.x} y1={pB.y} x2={pHeightB.x} y2={pHeightB.y} />
    <line x1={pC.x} y1={pC.y} x2={pHeightC.x} y2={pHeightC.y} />
  </g>
)}

{/* Биссектрисы */}
{showBisectors && (
  <g className="triangle-bisectors">
    <line x1={pA.x} y1={pA.y} x2={pBisectorA.x} y2={pBisectorA.y} />
    <line x1={pB.x} y1={pB.y} x2={pBisectorB.x} y2={pBisectorB.y} />
    <line x1={pC.x} y1={pC.y} x2={pBisectorC.x} y2={pBisectorC.y} />
  </g>
)}

        {/* Обозначение угла gamma */}
        <g className="triangle-angle">
          <path d={angleArcPath} />

          <text
            x={angleLabelPosition.x}
            y={angleLabelPosition.y}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {`γ = ${gamma.toFixed(1)}°`}
          </text>
        </g>

        {/* Вершины */}
        <g className="triangle-vertices">
          <circle cx={pA.x} cy={pA.y} r="4" />
          <circle cx={pB.x} cy={pB.y} r="4" />
          <circle cx={pC.x} cy={pC.y} r="4" />
        </g>

        {/* Подписи вершин и сторон */}
        <g className="triangle-labels">
          <text x={pA.x - 14} y={pA.y + 18}>A</text>
          <text x={pB.x + 8} y={pB.y + 18}>B</text>
          <text x={pC.x - 4} y={pC.y - 12}>C</text>

          <text
            x={(pA.x + pB.x) / 2}
            y={(pA.y + pB.y) / 2 + 18}
          >
            c
          </text>

          <text
            x={(pA.x + pC.x) / 2 - 14}
            y={(pA.y + pC.y) / 2}
          >
            b
          </text>

          <text
            x={(pB.x + pC.x) / 2 + 10}
            y={(pB.y + pC.y) / 2}
          >
            a
          </text>
        </g>
      </svg>
    </div>
  );
}
