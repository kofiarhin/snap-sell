const productService = require("../services/product.service");
const { sendSuccess } = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

exports.create = asyncHandler(async (req, res) => {
  const product = await productService.create(req.user._id, req.body);
  sendSuccess(res, { statusCode: 201, message: "Product created", data: product });
});

exports.update = asyncHandler(async (req, res) => {
  const product = await productService.update(req.params.id, req.user._id, req.body);
  sendSuccess(res, { message: "Product updated", data: product });
});

exports.remove = asyncHandler(async (req, res) => {
  await productService.remove(req.params.id, req.user._id);
  sendSuccess(res, { message: "Product deleted" });
});

exports.getAll = asyncHandler(async (req, res) => {
  const data = await productService.getPublicProducts(req.query);
  sendSuccess(res, { data });
});

exports.getBySlug = asyncHandler(async (req, res) => {
  const product = await productService.getBySlug(req.params.slug);
  sendSuccess(res, { data: product });
});

exports.getMyProducts = asyncHandler(async (req, res) => {
  const products = await productService.getSellerProducts(req.user._id);
  sendSuccess(res, { data: products });
});

exports.getSellerPublic = asyncHandler(async (req, res) => {
  const products = await productService.getSellerPublicProducts(req.params.sellerId);
  sendSuccess(res, { data: products });
});

exports.markSold = asyncHandler(async (req, res) => {
  const product = await productService.markSold(req.params.id, req.user._id);
  sendSuccess(res, { message: "Product marked as sold", data: product });
});

exports.archive = asyncHandler(async (req, res) => {
  const product = await productService.archive(req.params.id, req.user._id);
  sendSuccess(res, { message: "Product archived", data: product });
});

exports.reactivate = asyncHandler(async (req, res) => {
  const product = await productService.reactivate(req.params.id, req.user._id);
  sendSuccess(res, { message: "Product reactivated", data: product });
});
