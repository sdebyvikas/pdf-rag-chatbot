import express from "express";
import cors from "cors";
import { config } from "./config/env.js";
import { apiRouter } from "./routes.js";
import { errorHandler } from "./core/middleware/errorHandler.js";
import { logger } from "./core/utils/logger.js";
import { vectorStore } from "./features/vector-store/vectorStore.service.js";

const app = express();

// Middlewares
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(
      `${req.method} ${req.originalUrl} [${res.statusCode}] - ${duration}ms`,
    );
  });
  next();
});

// API Routes
app.use("/api", apiRouter);

// Global Error Handler
app.use(errorHandler);

// Initialize Vector Store & Start Server
async function bootstrap() {
  try {
    await vectorStore.init();
    const server = app.listen(config.port, () => {
      logger.success(
        `🚀 RAG Backend Server is listening on http://localhost:${config.port}`,
      );
      logger.info(
        `⚡ Health endpoint: http://localhost:${config.port}/api/health`,
      );
      logger.info(
        `📄 Ingestion endpoint: http://localhost:${config.port}/api/rag/upload`,
      );
      logger.info(
        `💬 Chat endpoint: http://localhost:${config.port}/api/rag/chat`,
      );
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        logger.error(
          `Port ${config.port} is already in use by another process.`,
        );
        logger.info(
          `To free port ${config.port} in PowerShell, run: Stop-Process -Id (Get-NetTCPConnection -LocalPort ${config.port}).OwningProcess -Force`,
        );
      } else {
        logger.error(`Server error: ${err.message}`);
      }
      process.exit(1);
    });
  } catch (err) {
    logger.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  }
}

bootstrap();
