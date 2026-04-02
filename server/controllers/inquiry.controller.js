const inquiryService = require("../services/inquiry.service");
const { sendSuccess } = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

exports.create = asyncHandler(async (req, res) => {
  const inquiry = await inquiryService.create(req.body);
  sendSuccess(res, { statusCode: 201, message: "Inquiry sent", data: inquiry });
});

exports.getSellerInquiries = asyncHandler(async (req, res) => {
  const data = await inquiryService.getSellerInquiries(req.user._id, req.query);
  sendSuccess(res, { data });
});

exports.getByProduct = asyncHandler(async (req, res) => {
  const data = await inquiryService.getByProduct(req.params.productId, req.user._id, req.query);
  sendSuccess(res, { data });
});

exports.getById = asyncHandler(async (req, res) => {
  const inquiry = await inquiryService.getById(req.params.id, req.user._id);
  sendSuccess(res, { data: inquiry });
});

exports.reply = asyncHandler(async (req, res) => {
  const inquiry = await inquiryService.reply(req.params.id, req.user._id, req.body.text);
  sendSuccess(res, { message: "Reply sent", data: inquiry });
});

exports.close = asyncHandler(async (req, res) => {
  const inquiry = await inquiryService.close(req.params.id, req.user._id);
  sendSuccess(res, { message: "Inquiry closed", data: inquiry });
});
