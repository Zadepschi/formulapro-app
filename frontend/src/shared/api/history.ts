
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export type CalculatorType =
  | "CIRCLE"
  | "TRIANGLE"
  | "SPHERE"
  | "CONE"
  | "PARALLELOGRAM"
  | "PRISM"
  | "QUIZ";

export interface Calculation {
  id: string;
  calculator: CalculatorType;
  inputs: Record<string, unknown>;
  results: Record<string, unknown>;
  createdAt: string;
}

interface HistoryResponse {
  calculations: Calculation[];
}

interface SaveCalculationResponse {
  message: string;
  calculation: Calculation;
}

export async function getHistory(): Promise<Calculation[]> {
  const response = await fetch(`${API_URL}/api/history`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("FETCH_HISTORY_FAILED");
  }

  const data: HistoryResponse = await response.json();
  return data.calculations;
}

export async function saveCalculation(
  calculator: CalculatorType,
  inputs: Record<string, unknown>,
  results: Record<string, unknown>
): Promise<Calculation> {
  const response = await fetch(`${API_URL}/api/history`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ calculator, inputs, results }),
  });

  if (!response.ok) {
    throw new Error("SAVE_CALCULATION_FAILED");
  }

  const data: SaveCalculationResponse = await response.json();
  return data.calculation;
}

export async function deleteCalculation(id: string): Promise<void> {
  const response = await fetch(
    `${API_URL}/api/history/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("DELETE_CALCULATION_FAILED");
  }
}

export async function clearHistory(): Promise<number> {
  const response = await fetch(`${API_URL}/api/history`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("CLEAR_HISTORY_FAILED");
  }

  const data: { deletedCount: number } = await response.json();
  return data.deletedCount;
}
