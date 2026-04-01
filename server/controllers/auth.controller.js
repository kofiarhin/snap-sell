const authService = require("../services/auth.service");
const { sendSuccess } = require("../utils/apiResponse");
const { cookieName, cookieOptions } = require("../config/cookie");
const asyncHandler = require("../utils/asyncHandler");

exports.register = asyncHandler(async (req, res) => {
  const { user, token } = await authService.register(req.body);
  res.cookie(cookieName, token, cookieOptions);
  sendSuccess(res, { statusCode: 201, message: "Registration successful", data: user });
});

exports.login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.login(req.body);
  res.cookie(cookieName, token, cookieOptions);
  sendSuccess(res, { message: "Login successful", data: user });
});

exports.logout = asyncHandler(async (_req, res) => {
  res.clearCookie(cookieName, cookieOptions);
  sendSuccess(res, { message: "Logged out successfully" });
});

exports.getMe = asyncHandler(async (req, res) => {
  sendSuccess(res, { data: req.user });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.user._id, req.body);
  sendSuccess(res, { message: "Profile updated", data: user });
});

exports.changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user._id, req.body);
  sendSuccess(res, { message: "Password changed successfully" });
});
