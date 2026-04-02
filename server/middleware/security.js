const crypto = require("crypto");
const env = require("../config/env");
const AppError = require("../utils/AppError");

const toMs = (windowMs) => Number(windowMs) || 15 * 60 * 1000;

const createRateLimiter = ({
  windowMs = 15 * 60 * 1000,
  max = 100,
  keyGenerator,
  message = "Too many requests, please try again later",
}) => {
  const store = new Map();
  const winMs = toMs(windowMs);

  return (req, res, next) => {
    const now = Date.now();
    const key =
      (keyGenerator && keyGenerator(req)) ||
      req.ip ||
      req.connection?.remoteAddress ||
      "anonymous";

    const entry = store.get(key);

    if (!entry || now > entry.resetAt) {
      store.set(key, { count: 1, resetAt: now + winMs });
      res.setHeader("X-RateLimit-Limit", max);
      res.setHeader("X-RateLimit-Remaining", max - 1);
      return next();
    }

    entry.count += 1;

    const remaining = Math.max(max - entry.count, 0);
    res.setHeader("X-RateLimit-Limit", max);
    res.setHeader("X-RateLimit-Remaining", remaining);

    if (entry.count > max) {
      res.setHeader("Retry-After", Math.ceil((entry.resetAt - now) / 1000));
      throw new AppError(message, 429, "RATE_LIMITED");
    }

    return next();
  };
};

const securityHeaders = (_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("X-DNS-Prefetch-Control", "off");
  res.setHeader("Strict-Transport-Security", "max-age=15552000; includeSubDomains");
  next();
};

const requestContext = (req, res, next) => {
  const requestId = crypto.randomUUID();
  req.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);
  next();
};

const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const payload = {
      level: "info",
      type: "request",
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - start,
      ip: req.ip,
      userId: req.user?._id?.toString?.() || null,
      timestamp: new Date().toISOString(),
    };

    console.log(JSON.stringify(payload));
  });

  next();
};

const csrfOriginProtection = (req, _res, next) => {
  const unsafeMethod = ["POST", "PUT", "PATCH", "DELETE"].includes(req.method);

  if (!unsafeMethod) {
    return next();
  }

  const hasSessionCookie = Boolean(req.cookies?.[env.COOKIE_NAME]);
  if (!hasSessionCookie) {
    return next();
  }

  const origin = req.get("origin");
  if (!origin) {
    throw new AppError("Missing request origin", 403, "CSRF_BLOCKED");
  }

  const allowedOrigin = env.CLIENT_URL.replace(/\/$/, "");
  const requestOrigin = origin.replace(/\/$/, "");

  if (requestOrigin !== allowedOrigin) {
    throw new AppError("CSRF origin validation failed", 403, "CSRF_BLOCKED");
  }

  return next();
};

module.exports = {
  createRateLimiter,
  securityHeaders,
  requestContext,
  requestLogger,
  csrfOriginProtection,
};
