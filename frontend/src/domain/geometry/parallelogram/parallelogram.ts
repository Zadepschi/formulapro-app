
import type {
  ParallelogramInput,
  ParallelogramResults,
} from "./parallelogram.types";

export function calculateParallelogram(
  input: ParallelogramInput
): ParallelogramResults {
  const { a, b, h } = input;

  if (
    !Number.isFinite(a) ||
    !Number.isFinite(b) ||
    !Number.isFinite(h) ||
    a <= 0 ||
    b <= 0 ||
    h <= 0
  ) {
    throw new Error("All parameters must be positive numbers.");
  }

  if (h > b) {
    throw new Error("Height cannot be greater than side b.");
  }

  const perimeter = 2 * (a + b);
  const area = a * h;

  return {
    a,
    b,
    h,
    perimeter,
    area,
  };
}
