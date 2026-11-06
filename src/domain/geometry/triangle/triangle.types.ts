export type TriangleInput =
  | {
      mode: "sss";
      a: number;
      b: number;
      c: number;
    }
  | {
      mode: "sas";
      a: number;
      b: number;
      gamma: number;
    };

export interface TriangleResults {
  a: number;
  b: number;
  c: number;

  alpha: number;
  beta: number;
  gamma: number;

  perimeter: number;
  semiperimeter: number;
  area: number;

  heights: {
    a: number;
    b: number;
    c: number;
  };

  medians: {
    a: number;
    b: number;
    c: number;
  };

  bisectors: {
    a: number;
    b: number;
    c: number;
  };

  incircle: {
    radius: number;
    diameter: number;
    circumference: number;
    area: number;
  };

  circumcircle: {
    radius: number;
    diameter: number;
    circumference: number;
    area: number;
  };
}