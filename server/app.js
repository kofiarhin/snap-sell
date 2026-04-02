const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const env = require("./config/env");
const errorHandler = require("./middleware/errorHandler");
const {
  createRateLimiter,
  csrfOriginProtection,
  requestContext,
  requestLogger,
  securityHeaders,
} = require("./middleware/security");

const app = express();

// Middleware
app.set("trust proxy", 1);
app.use(requestContext);
app.use(requestLogger);
app.use(securityHeaders);
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [env.CLIENT_URL].filter(Boolean),
    credentials: true,
  })
);
app.use(createRateLimiter({ windowMs: 15 * 60 * 1000, max: 200 }));
app.use(csrfOriginProtection);

// Health check
app.get("/", (_req, res) => {
  res.json({ message: "Welcome to SnapSell API" });
});
app.get("/health/live", (_req, res) => {
  res.status(200).json({ success: true, message: "live" });
});
app.get("/health/ready", (_req, res) => {
  res.status(200).json({ success: true, message: "ready" });
});

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/uploads", require("./routes/upload.routes"));
app.use("/api/categories", require("./routes/category.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/inquiries", require("./routes/inquiry.routes"));
app.use("/api/admin", require("./routes/admin.routes"));

// Error handler
app.use(errorHandler);

module.exports = app;
