import app from "./app";
import { config } from "./config/env";

const server = app.listen(config.port, () => {
  console.log(
    `Server listening on port ${config.port} in [${config.nodeEnv}] mode`,
  );
  console.log(
    `Health check available at: http://localhost:${config.port}/api/health`,
  );
});

const handleShutdown = (signal: string) => {
  console.log(`\n${signal} received. Closing HTTP server gracefully...`);
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Forced shutdown due to timeout.");
    process.exit(1);
  }, 10000).unref();
};

process.on("SIGTERM", () => handleShutdown("SIGTERM"));
process.on("SIGINT", () => handleShutdown("SIGINT"));

process.on("unhandledRejection", (reason: unknown) => {
  console.error("Unhandled Promise Rejection:", reason);
});

process.on("uncaughtException", (error: Error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});
