const Category = require("../models/Category");
const { sendSuccess } = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

exports.getCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find({ isActive: true }).sort("sortOrder").lean();
  sendSuccess(res, { data: categories });
});
