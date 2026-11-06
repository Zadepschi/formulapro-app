import type {
  TriangleInput,
  TriangleResults,
} from "./triangle.types";

const toRadians = (degrees: number) =>
  (degrees * Math.PI) / 180;

const toDegrees = (radians: number) =>
  (radians * 180) / Math.PI;

const clamp = (value: number) =>
  Math.max(-1, Math.min(1, value));

function calculateAngle(
  opposite: number,
  side1: number,
  side2: number
): number {
  const cosValue =
    (side1 ** 2 + side2 ** 2 - opposite ** 2) /
    (2 * side1 * side2);

  return toDegrees(Math.acos(clamp(cosValue)));
}

export function calculateTriangle(
  input: TriangleInput
): TriangleResults {
  let { a, b } = input;
  let c: number;
  let gamma: number;

  if (
    !Number.isFinite(a) ||
    !Number.isFinite(b) ||
    a <= 0 ||
    b <= 0
  ) {
    throw new Error("Sides must be greater than zero.");
  }

  if (input.mode === "sss") {
    c = input.c;

    if (!Number.isFinite(c) || c <= 0) {
      throw new Error("Side c must be greater than zero.");
    }

    if (a + b <= c || a + c <= b || b + c <= a) {
      throw new Error("These sides cannot form a triangle.");
    }

    gamma = calculateAngle(c, a, b);
  } else {
    gamma = input.gamma;

    if (
      !Number.isFinite(gamma) ||
      gamma <= 0 ||
      gamma >= 180
    ) {
      throw new Error("The angle must be between 0 and 180 degrees.");
    }

    const gammaRad = toRadians(gamma);

    c = Math.sqrt(
      a ** 2 +
        b ** 2 -
        2 * a * b * Math.cos(gammaRad)
    );
  }

  const alpha = calculateAngle(a, b, c);
  const beta = 180 - alpha - gamma;

  const perimeter = a + b + c;
  const semiperimeter = perimeter / 2;

  const area =
    0.5 * a * b * Math.sin(toRadians(gamma));

  const heights = {
    a: (2 * area) / a,
    b: (2 * area) / b,
    c: (2 * area) / c,
  };

  const medians = {
    a: 0.5 * Math.sqrt(
      2 * b ** 2 + 2 * c ** 2 - a ** 2
    ),
    b: 0.5 * Math.sqrt(
      2 * a ** 2 + 2 * c ** 2 - b ** 2
    ),
    c: 0.5 * Math.sqrt(
      2 * a ** 2 + 2 * b ** 2 - c ** 2
    ),
  };

  const bisectors = {
    a: Math.sqrt(
      b * c *
      ((b + c) ** 2 - a ** 2)
    ) / (b + c),

    b: Math.sqrt(
      a * c *
      ((a + c) ** 2 - b ** 2)
    ) / (a + c),

    c: Math.sqrt(
      a * b *
      ((a + b) ** 2 - c ** 2)
    ) / (a + b),
  };

  const inradius = area / semiperimeter;
  const circumradius = (a * b * c) / (4 * area);

  return {
    a,
    b,
    c,
    alpha,
    beta,
    gamma,
    perimeter,
    semiperimeter,
    area,

    heights,
    medians,
    bisectors,

    incircle: {
      radius: inradius,
      diameter: 2 * inradius,
      circumference: 2 * Math.PI * inradius,
      area: Math.PI * inradius ** 2,
    },

    circumcircle: {
      radius: circumradius,
      diameter: 2 * circumradius,
      circumference: 2 * Math.PI * circumradius,
      area: Math.PI * circumradius ** 2,
    },
  };
}