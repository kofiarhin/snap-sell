const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const env = require("./config/env");
const errorHandler = require("./middleware/errorHandler");

const app = express();

const configuredOrigins = (env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const isAllowedDevOrigin = (origin) =>
  env.NODE_ENV !== "production" &&
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (configuredOrigins.includes(origin) || isAllowedDevOrigin(origin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
};

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// Health check
app.get("/", (_req, res) => {
  res.json({ message: "Welcome to SnapSell API" });
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
