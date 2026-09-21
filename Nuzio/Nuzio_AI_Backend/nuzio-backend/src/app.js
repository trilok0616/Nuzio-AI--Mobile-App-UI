const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const newsRoutes = require("./routes/news.routes");
const savedRoutes = require("./routes/saved.routes");
const briefRoutes = require("./routes/brief.routes");
const voiceRoutes = require("./routes/voice.routes");
const billingRoutes = require("./routes/billing.routes");
const { stripeWebhook } = require("./controllers/billing.controller");
const { notFound, errorHandler } = require("./middleware/error");

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN
      ? process.env.CLIENT_ORIGIN.split(",").map((x) => x.trim())
      : true,
    credentials: true
  })
);

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-8",
    legacyHeaders: false
  })
);

app.post(
  "/api/v1/billing/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    service: "nuzio-backend",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/news", newsRoutes);
app.use("/api/v1/saved", savedRoutes);
app.use("/api/v1/brief", briefRoutes);
app.use("/api/v1/voices", voiceRoutes);
app.use("/api/v1/billing", billingRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
