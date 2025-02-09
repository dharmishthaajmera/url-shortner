const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const { commonErrorHandler } = require("./src/helpers/error-handler");

const app = express();
app.use(express.json());

const authRouter = require("./src/routes/auth.route");
const urlShortner = require("./src/routes/url-shortner.route");
const urlAnalytics = require("./src/routes/analytics.route");

// Enable cors support to accept cross origin requests
app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));

// Enable helmet js middlewares to configure secure headers
app.use(helmet());

// Enable gzip compression module for REST API
app.use(compression());

// REST API entry point
app.use(authRouter);

app.use(urlShortner);

app.use(urlAnalytics);

app.use("/health", (_req, res) => {
  res.send({ message: "Application running successfully!" });
});

// 404 Error Handling
app.use((req, res) => {
  const message = "Internal Server Error";
  commonErrorHandler(req, res, message, 500);
});

process.on("uncaughtException", (err, origin) => {
  console.error(`Uncaught Exception: ${err.message}`);
  console.error(`Exception origin: ${origin}`);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received: Shutting down gracefully");
});

process.on("SIGINT", () => {
  console.log("SIGINT received: Shutting down gracefully");
});

module.exports = app;
