const sendSuccess = (res, { statusCode = 200, message = "Success", data = null }) => {
  const response = { success: true, message };
  if (data !== null) response.data = data;
  return res.status(statusCode).json(response);
};

const sendError = (res, { statusCode = 500, code = "SERVER_ERROR", message = "Something went wrong", details = null }) => {
  const response = {
    success: false,
    error: { code, message },
  };
  if (details) response.error.details = details;
  return res.status(statusCode).json(response);
};

module.exports = { sendSuccess, sendError };
