import type { ConeInput, ConeResults } from "./cone.types";

export function calculateCone(input: ConeInput): ConeResults {
  const { radius, height } = input;

  if (
    !Number.isFinite(radius) ||
    !Number.isFinite(height) ||
    radius <= 0 ||
    height <= 0
  ) {
    throw new Error("Radius and height must be positive numbers.");
  }

  const slantHeight = Math.sqrt(
    radius * radius + height * height
  );

  const volume =
    (Math.PI * radius * radius * height) / 3;

  const surfaceArea =
    Math.PI * radius * (radius + slantHeight);

  return {
    radius,
    height,
    slantHeight,
    volume,
    surfaceArea,
  };
}