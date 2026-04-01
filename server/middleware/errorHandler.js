const { sendError } = require("../utils/apiResponse");

const errorHandler = (err, req, res, _next) => {
  // Mongoose validation error
  if (err.name === "ValidationError") {
    const details = Object.values(err.errors).map((e) => e.message);
    return sendError(res, {
      statusCode: 400,
      code: "VALIDATION_ERROR",
      message: "Validation failed",
      details,
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return sendError(res, {
      statusCode: 409,
      code: "DUPLICATE_KEY",
      message: `${field} already exists`,
    });
  }

  // Mongoose cast error (bad ObjectId etc.)
  if (err.name === "CastError") {
    return sendError(res, {
      statusCode: 400,
      code: "INVALID_ID",
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return sendError(res, {
      statusCode: 401,
      code: "AUTH_ERROR",
      message: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return sendError(res, {
      statusCode: 401,
      code: "AUTH_ERROR",
      message: "Token expired",
    });
  }

  // Zod validation error (request validation)
  if (err.name === "ZodError") {
    const details = err.errors.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));
    return sendError(res, {
      statusCode: 400,
      code: "VALIDATION_ERROR",
      message: "Validation failed",
      details,
    });
  }

  // Operational AppError
  if (err.isOperational) {
    return sendError(res, {
      statusCode: err.statusCode,
      code: err.code,
      message: err.message,
    });
  }

  // Unknown error
  console.error("Unhandled error:", err);
  return sendError(res, {
    statusCode: 500,
    code: "SERVER_ERROR",
    message: "Something went wrong",
  });
};

module.exports = errorHandler;
