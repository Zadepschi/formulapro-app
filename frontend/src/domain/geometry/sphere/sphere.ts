import type {
  SphereInput,
  SphereResults,
} from "./sphere.types";

export function calculateSphere(
  input: SphereInput,
): SphereResults {
  const { radius } = input;

  if (!Number.isFinite(radius) || radius <= 0) {
    throw new Error("Radius must be a positive number.");
  }

  const surfaceArea = 4 * Math.PI * Math.pow(radius, 2);

  const volume =
    (4 / 3) * Math.PI * Math.pow(radius, 3);

  return {
    radius,
    surfaceArea,
    volume,
  };
}