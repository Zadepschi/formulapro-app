
interface ParallelogramSvgProps {
  a: number;
  b: number;
  h: number;
}

export function ParallelogramSvg({
  a,
  b,
  h,
}: ParallelogramSvgProps) {
  // Горизонтальная проекция боковой стороны.
  const horizontal = Math.sqrt(Math.max(0, b * b - h * h));

  const viewWidth = 440;
  const viewHeight = 300;
  const padding = 65;

  const minX = Math.min(0, horizontal);
  const maxX = a + Math.max(0, horizontal);

  const scale = Math.min(
    (viewWidth - padding * 2) / Math.max(maxX - minX, 0.001),
    (viewHeight - padding * 2) / Math.max(h, 0.001)
  );

  const offsetX =
    (viewWidth - (maxX - minX) * scale) / 2 - minX * scale;

  const offsetY =
    (viewHeight + h * scale) / 2;

  const point = (x: number, y: number) => ({
    x: x * scale + offsetX,
    y: offsetY - y * scale,
  });

  const A = point(0, 0);
  const B = point(a, 0);
  const D = point(horizontal, h);
  const C = point(a + horizontal, h);

  const H = point(horizontal, 0);

  return (
    <div className="parallelogram-svg-wrapper">
      <svg
        className="parallelogram-svg"
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        role="img"
        aria-label="Parallelogram with base, side and height"
      >
        {/* Высота */}
        <line
          x1={D.x}
          y1={D.y}
          x2={H.x}
          y2={H.y}
          className="parallelogram-height"
        />

        {/* Прямой угол */}
        <polyline
          points={`
            ${H.x},${H.y - 9}
            ${H.x + 9},${H.y - 9}
            ${H.x + 9},${H.y}
          `}
          className="parallelogram-right-angle"
        />

        {/* Фигура */}
        <polygon
          points={`
            ${A.x},${A.y}
            ${B.x},${B.y}
            ${C.x},${C.y}
            ${D.x},${D.y}
          `}
          className="parallelogram-shape"
        />

        {/* Вершины */}
        {[A, B, C, D].map((p, index) => (
          <circle
            key={index}
            cx={p.x}
            cy={p.y}
            r="4"
            className="parallelogram-vertex"
          />
        ))}

        {/* Названия вершин */}
        <g className="parallelogram-labels">
          <text x={A.x - 15} y={A.y + 18}>A</text>
          <text x={B.x + 8} y={B.y + 18}>B</text>
          <text x={C.x + 8} y={C.y - 8}>C</text>
          <text x={D.x - 17} y={D.y - 8}>D</text>

          {/* Основание */}
          <text
            x={(A.x + B.x) / 2}
            y={A.y + 34}
            textAnchor="middle"
          >
            a = {a}
          </text>

          {/* Боковая сторона */}
          <text
            x={(B.x + C.x) / 2 + 15}
            y={(B.y + C.y) / 2}
          >
            b = {b}
          </text>

          {/* Высота */}
          <text
            x={H.x - 12}
            y={(D.y + H.y) / 2}
            textAnchor="end"
          >
            h = {h}
          </text>
        </g>
      </svg>
    </div>
  );
}
