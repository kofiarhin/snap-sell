const jwt = require("jsonwebtoken");
const env = require("../config/env");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const authenticate = asyncHandler(async (req, _res, next) => {
  const token = req.cookies[env.COOKIE_NAME];

  if (!token) {
    throw new AppError("Not authenticated", 401, "AUTH_ERROR");
  }

  const decoded = jwt.verify(token, env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user) {
    throw new AppError("User not found", 401, "AUTH_ERROR");
  }

  if (!user.isActive) {
    throw new AppError("Account is suspended", 403, "FORBIDDEN");
  }

  req.user = user;
  next();
});

const authorize = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) {
    throw new AppError("Not authorized", 403, "FORBIDDEN");
  }
  next();
};

module.exports = { authenticate, authorize };
