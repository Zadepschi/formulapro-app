import type { PrismInput, PrismResults } from "./prism.types";

export function calculatePrism(input: PrismInput): PrismResults {
  const { length, width, height } = input;

  if (
    !Number.isFinite(length) ||
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    length <= 0 ||
    width <= 0 ||
    height <= 0
  ) {
    throw new Error(
      "Length, width and height must be positive numbers."
    );
  }

  const volume = length * width * height;

  const surfaceArea =
    2 * (
      length * width +
      length * height +
      width * height
    );

  return {
    length,
    width,
    height,
    volume,
    surfaceArea,
  };
}