import { useEffect, useRef } from "react";

interface CircleCanvasProps {
  radius: number;
  angle: number;
}

export function CircleCanvas({
  radius,
  angle,
}: CircleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const width = rect.width;
      const height = rect.height;

      const centerX = width / 2;
      const centerY = height / 2;

      const visualRadius = Math.min(width, height) * 0.36;

      ctx.clearRect(0, 0, width, height);

      // Background
      ctx.fillStyle = "rgba(47, 199, 255, 0.04)";
      ctx.fillRect(0, 0, width, height);

      // Circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, visualRadius, 0, Math.PI * 2);

      ctx.fillStyle = "rgba(47, 199, 255, 0.12)";
      ctx.fill();

      ctx.strokeStyle = "#2fc7ff";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Sector
      if (angle > 0) {
        const startAngle = 0;
        const endAngle = (angle * Math.PI) / 180;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(
          centerX,
          centerY,
          visualRadius,
          startAngle,
          endAngle
        );
        ctx.closePath();

        ctx.fillStyle = "rgba(255, 120, 80, 0.35)";
        ctx.fill();

        ctx.strokeStyle = "#ff7850";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Radius line
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + visualRadius, centerY);

      ctx.strokeStyle = "#e34b4b";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Center point
      ctx.beginPath();
      ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);

      ctx.fillStyle = "#e34b4b";
      ctx.fill();

      // Radius label
      ctx.font = "14px Arial";
      ctx.fillStyle = "currentColor";
      ctx.fillText(
        `r = ${radius}`,
        centerX + visualRadius / 2 - 15,
        centerY - 12
      );

      // Angle label
      if (angle > 0) {
        const middleAngle = (angle / 2) * (Math.PI / 180);

        const labelX =
          centerX + visualRadius * 0.45 * Math.cos(middleAngle);

        const labelY =
          centerY + visualRadius * 0.45 * Math.sin(middleAngle);

        ctx.fillStyle = "#e34b4b";
        ctx.fillText(`${angle}°`, labelX, labelY);
      }
    };

    draw();

    const resizeObserver = new ResizeObserver(draw);
    resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
    };
  }, [radius, angle]);

  return (
    <canvas
      ref={canvasRef}
      className="circle-canvas"
      aria-label={`Circle with radius ${radius} and sector angle ${angle} degrees`}
    />
  );
}