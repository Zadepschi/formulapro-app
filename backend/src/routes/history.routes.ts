
import { Router, type Request, type Response } from "express";
import { randomBytes, createHash } from "node:crypto";
import { prisma } from "../lib/prisma.js";
import type {
  CalculatorType,
  Prisma,
} from "../generated/prisma/client.js";

const router = Router();

const COOKIE_NAME = "fp_guest";
const SESSION_DAYS = 30;

const CALCULATORS = [
  "CIRCLE",
  "TRIANGLE",
  "SPHERE",
  "CONE",
  "PARALLELOGRAM",
  "PRISM",
  "QUIZ",
] as const;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function isJsonObject(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

async function getGuestSession(
  req: Request,
  res: Response
): Promise<string> {
  const token = req.cookies?.[COOKIE_NAME];

  if (typeof token === "string" && token.length > 0) {
    const tokenHash = hashToken(token);

    const existingSession = await prisma.guestSession.findUnique({
      where: { tokenHash },
    });

    if (existingSession && existingSession.expiresAt > new Date()) {
      return existingSession.id;
    }

    if (existingSession) {
      await prisma.guestSession.delete({
        where: { id: existingSession.id },
      });
    }
  }

  const newToken = randomBytes(32).toString("hex");

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DAYS);

  const session = await prisma.guestSession.create({
    data: {
      tokenHash: hashToken(newToken),
      expiresAt,
    },
  });

  res.cookie(COOKIE_NAME, newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DAYS * 24 * 60 * 60 * 1000,
    path: "/",
  });

  return session.id;
}

// POST /api/history
// Сохранить вычисление
router.post("/", async (req: Request, res: Response) => {
  try {
    const { calculator, inputs, results } = req.body ?? {};

    if (
      typeof calculator !== "string" ||
      !CALCULATORS.includes(
        calculator as (typeof CALCULATORS)[number]
      )
    ) {
      res.status(400).json({
        error: "UNKNOWN_CALCULATOR",
      });
      return;
    }

    if (!isJsonObject(inputs) || !isJsonObject(results)) {
      res.status(400).json({
        error: "INVALID_CALCULATION_DATA",
      });
      return;
    }

    const guestSessionId = await getGuestSession(req, res);

    const calculation = await prisma.calculation.create({
      data: {
        calculator: calculator as CalculatorType,
        inputs: inputs as Prisma.InputJsonValue,
        results: results as Prisma.InputJsonValue,
        guestSessionId,
      },
    });

    res.status(201).json({
      message: "CALCULATION_SAVED",
      calculation,
    });
  } catch (error) {
    console.error("Error saving calculation:", error);

    res.status(500).json({
      error: "SAVE_CALCULATION_FAILED",
    });
  }
});

// GET /api/history
// Получить историю вычислений
router.get("/", async (req: Request, res: Response) => {
  try {
    const guestSessionId = await getGuestSession(req, res);

    const calculations = await prisma.calculation.findMany({
      where: { guestSessionId },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    res.status(200).json({
      calculations,
    });
  } catch (error) {
    console.error("Error fetching history:", error);

    res.status(500).json({
      error: "FETCH_HISTORY_FAILED",
    });
  }
});

// DELETE /api/history/:id
// Удалить одну запись
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const guestSessionId = await getGuestSession(req, res);

    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!id) {
      res.status(400).json({
        error: "CALCULATION_ID_REQUIRED",
      });
      return;
    }

    const result = await prisma.calculation.deleteMany({
      where: {
        id,
        guestSessionId,
      },
    });

    if (result.count === 0) {
      res.status(404).json({
        error: "CALCULATION_NOT_FOUND",
      });
      return;
    }

    res.status(200).json({
      message: "CALCULATION_DELETED",
    });
  } catch (error) {
    console.error("Error deleting calculation:", error);

    res.status(500).json({
      error: "DELETE_CALCULATION_FAILED",
    });
  }
});

// DELETE /api/history
// Очистить всю историю
router.delete("/", async (req: Request, res: Response) => {
  try {
    const guestSessionId = await getGuestSession(req, res);

    const result = await prisma.calculation.deleteMany({
      where: { guestSessionId },
    });

    res.status(200).json({
      message: "HISTORY_CLEARED",
      deletedCount: result.count,
    });
  } catch (error) {
    console.error("Error clearing history:", error);

    res.status(500).json({
      error: "CLEAR_HISTORY_FAILED",
    });
  }
});

export default router;
