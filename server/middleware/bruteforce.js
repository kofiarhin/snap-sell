const AppError = require("../utils/AppError");

const attempts = new Map();

const getClientIp = (req) => req.ip || req.connection?.remoteAddress || "unknown";

const authBruteForceProtection = ({ maxAttempts = 5, windowMs = 10 * 60 * 1000 } = {}) => {
  return (req, _res, next) => {
    const email = (req.body?.email || "").toLowerCase().trim();
    const key = `${getClientIp(req)}:${email}`;
    const now = Date.now();

    const entry = attempts.get(key);

    if (!entry || now > entry.resetAt) {
      attempts.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (entry.count >= maxAttempts) {
      throw new AppError("Too many login attempts. Try again later.", 429, "RATE_LIMITED");
    }

    entry.count += 1;
    return next();
  };
};

const clearAuthAttempts = (req) => {
  const email = (req.body?.email || "").toLowerCase().trim();
  const key = `${getClientIp(req)}:${email}`;
  attempts.delete(key);
};

module.exports = { authBruteForceProtection, clearAuthAttempts };
