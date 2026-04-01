const adminService = require("../services/admin.service");
const { sendSuccess } = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

exports.getSellers = asyncHandler(async (_req, res) => {
  const sellers = await adminService.getSellers();
  sendSuccess(res, { data: sellers });
});

exports.getSellerById = asyncHandler(async (req, res) => {
  const seller = await adminService.getSellerById(req.params.id);
  sendSuccess(res, { data: seller });
});

exports.suspendSeller = asyncHandler(async (req, res) => {
  const seller = await adminService.suspendSeller(req.params.id);
  sendSuccess(res, { message: "Seller suspended", data: seller });
});

exports.activateSeller = asyncHandler(async (req, res) => {
  const seller = await adminService.activateSeller(req.params.id);
  sendSuccess(res, { message: "Seller activated", data: seller });
});

exports.getProducts = asyncHandler(async (req, res) => {
  const data = await adminService.getProducts(req.query);
  sendSuccess(res, { data });
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await adminService.updateProduct(req.params.id, req.body);
  sendSuccess(res, { message: "Product updated", data: product });
});

exports.removeProduct = asyncHandler(async (req, res) => {
  await adminService.removeProduct(req.params.id);
  sendSuccess(res, { message: "Product removed" });
});
