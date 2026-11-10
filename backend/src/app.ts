import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import historyRoutes from "./routes/history.routes.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// Проверка работоспособности API
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "FormulaPro API is running",
    timestamp: new Date().toISOString(),
  });
});

// API истории вычислений
app.use("/api/history", historyRoutes);

export default app;