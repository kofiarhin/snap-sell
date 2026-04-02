const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const env = require("../config/env");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const { sendPasswordResetEmail } = require("../utils/email");

const generateToken = (userId) =>
  jwt.sign({ id: userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });

const register = async ({ fullName, email, password, profileImage }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError("Email already registered", 409, "DUPLICATE_KEY");
  }

  const user = await User.create({
    fullName,
    email,
    password,
    profileImage,
  });

  const token = generateToken(user._id);
  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401, "AUTH_ERROR");
  }

  if (!user.isActive) {
    throw new AppError("Account is suspended", 403, "FORBIDDEN");
  }

  const token = generateToken(user._id);
  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};

const updateProfile = async (userId, { fullName, email, profileImage }) => {
  const updates = {};
  if (fullName) updates.fullName = fullName;
  if (email) updates.email = email;
  if (profileImage) updates.profileImage = profileImage;

  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  });

  if (!user) throw new AppError("User not found", 404, "NOT_FOUND");
  return user;
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select("+password");
  if (!user) throw new AppError("User not found", 404, "NOT_FOUND");

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new AppError("Current password is incorrect", 400, "VALIDATION_ERROR");
  }

  user.password = newPassword;
  await user.save();
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal whether user exists
    return;
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${env.CLIENT_URL}/reset-password/${resetToken}`;

  try {
    await sendPasswordResetEmail(user.email, resetUrl);
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new AppError("Failed to send reset email. Try again later.", 500, "EMAIL_ERROR");
  }
};

const resetPassword = async (token, password) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError("Invalid or expired reset token", 400, "VALIDATION_ERROR");
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
};

module.exports = { register, login, updateProfile, changePassword, forgotPassword, resetPassword };
