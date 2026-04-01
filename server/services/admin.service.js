const User = require("../models/User");
const Product = require("../models/Product");
const { deleteMultipleAssets } = require("./upload.service");
const AppError = require("../utils/AppError");

const getSellers = async () => {
  return User.find({ role: "seller" }).sort("-createdAt").lean();
};

const getSellerById = async (sellerId) => {
  const seller = await User.findById(sellerId).lean();
  if (!seller || seller.role !== "seller") {
    throw new AppError("Seller not found", 404, "NOT_FOUND");
  }
  return seller;
};

const suspendSeller = async (sellerId) => {
  const seller = await User.findById(sellerId);
  if (!seller || seller.role !== "seller") {
    throw new AppError("Seller not found", 404, "NOT_FOUND");
  }
  seller.isActive = false;
  await seller.save();
  return seller;
};

const activateSeller = async (sellerId) => {
  const seller = await User.findById(sellerId);
  if (!seller || seller.role !== "seller") {
    throw new AppError("Seller not found", 404, "NOT_FOUND");
  }
  seller.isActive = true;
  await seller.save();
  return seller;
};

const getProducts = async (query) => {
  const { page = 1, limit = 20, search, status, seller } = query;
  const filter = {};
  if (status) filter.status = status;
  if (seller) filter.seller = seller;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort("-createdAt")
      .skip(skip)
      .limit(Number(limit))
      .populate("seller", "fullName email profileImage isActive")
      .lean(),
    Product.countDocuments(filter),
  ]);

  return {
    products,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  };
};

const updateProduct = async (productId, data) => {
  const product = await Product.findByIdAndUpdate(productId, data, {
    new: true,
    runValidators: true,
  });
  if (!product) throw new AppError("Product not found", 404, "NOT_FOUND");
  return product;
};

const removeProduct = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) throw new AppError("Product not found", 404, "NOT_FOUND");

  await deleteMultipleAssets(product.images.map((img) => img.publicId));
  await product.deleteOne();
};

module.exports = {
  getSellers,
  getSellerById,
  suspendSeller,
  activateSeller,
  getProducts,
  updateProduct,
  removeProduct,
};
