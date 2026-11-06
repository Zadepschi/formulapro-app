import type { CircleInput, CircleResults } from "./circle.types";

export function calculateCircle({
  radius,
  angle,
}: CircleInput): CircleResults {
  if (!Number.isFinite(radius) || radius <= 0) {
    throw new Error("Radius must be greater than zero.");
  }

  if (!Number.isFinite(angle) || angle < 0 || angle > 360) {
    throw new Error("Angle must be between 0 and 360 degrees.");
  }

  return {
    diameter: 2 * radius,
    circumference: 2 * Math.PI * radius,
    area: Math.PI * radius ** 2,
    arcLength: 2 * Math.PI * radius * (angle / 360),
  };
}