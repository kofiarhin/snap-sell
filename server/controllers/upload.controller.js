const uploadService = require("../services/upload.service");
const { sendSuccess } = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

exports.getSignature = asyncHandler(async (req, res) => {
  const { intent } = req.body;
  const data = uploadService.generateSignature(intent);
  sendSuccess(res, { data });
});
