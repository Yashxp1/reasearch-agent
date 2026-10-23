import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config/env";
import { apiRouter } from "./routes";
import { notFoundHandler } from "./middlewares/notFound.middleware";
import { errorHandler } from "./middlewares/error.middleware";

const app: Application = express();

// Security and utility middlewares
app.use(helmet());
app.use(
  cors({
    origin: config.corsOrigin === "*" ? "*" : config.corsOrigin.split(","),
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP logger
if (config.nodeEnv !== "test") {
  app.use(morgan(config.isProduction ? "combined" : "dev"));
}

// Root route
app.get("/", (_req, res) => {
  res.json({
    name: "Backend API",
    status: "running",
    docs: "/api/health",
  });
});

// Mount API routes
app.use("/api", apiRouter);

// Fallback 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;
