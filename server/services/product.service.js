const Product = require("../models/Product");
const Category = require("../models/Category");
const Inquiry = require("../models/Inquiry");
const { deleteMultipleAssets } = require("./upload.service");
const { createUniqueSlug } = require("../utils/slugify");
const AppError = require("../utils/AppError");

const validateCategory = async (categoryValue) => {
  const category = await Category.findOne({ value: categoryValue, isActive: true }).lean();
  if (!category) throw new AppError("Invalid category", 400, "VALIDATION_ERROR");
  return { label: category.label, value: category.value, slug: category.slug };
};

const create = async (sellerId, data) => {
  const category = await validateCategory(data.category);
  const slug = await createUniqueSlug(Product, data.title);

  const product = await Product.create({
    seller: sellerId,
    title: data.title,
    slug,
    description: data.description,
    price: data.price,
    quantity: data.quantity,
    category,
    images: data.images,
  });

  return product;
};

const update = async (productId, sellerId, data) => {
  const product = await Product.findById(productId);
  if (!product) throw new AppError("Product not found", 404, "NOT_FOUND");
  if (product.seller.toString() !== sellerId.toString()) {
    throw new AppError("Not authorized", 403, "FORBIDDEN");
  }

  if (data.title && data.title !== product.title) {
    product.slug = await createUniqueSlug(Product, data.title, product._id);
    product.title = data.title;
  }
  if (data.description !== undefined) product.description = data.description;
  if (data.price !== undefined) product.price = data.price;
  if (data.quantity !== undefined) product.quantity = data.quantity;

  if (data.category) {
    product.category = await validateCategory(data.category);
  }

  if (data.images) {
    // Find images that were removed and clean up
    const newPublicIds = new Set(data.images.map((img) => img.publicId));
    const removedImages = product.images.filter((img) => !newPublicIds.has(img.publicId));
    if (removedImages.length > 0) {
      await deleteMultipleAssets(removedImages.map((img) => img.publicId));
    }
    product.images = data.images;
  }

  await product.save();
  return product;
};

const remove = async (productId, sellerId) => {
  const product = await Product.findById(productId);
  if (!product) throw new AppError("Product not found", 404, "NOT_FOUND");
  if (product.seller.toString() !== sellerId.toString()) {
    throw new AppError("Not authorized", 403, "FORBIDDEN");
  }

  await deleteMultipleAssets(product.images.map((img) => img.publicId));
  await product.deleteOne();
};

const getPublicProducts = async (query) => {
  const { page = 1, limit = 12, search, category, sort = "-createdAt", seller } = query;

  const filter = { status: "active" };
  if (category) filter["category.slug"] = category;
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
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate("seller", "fullName profileImage")
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

const getBySlug = async (slug) => {
  const product = await Product.findOne({ slug })
    .populate("seller", "fullName profileImage")
    .lean();
  if (!product) throw new AppError("Product not found", 404, "NOT_FOUND");
  return product;
};

const getSellerProducts = async (sellerId) => {
  return Product.find({ seller: sellerId }).sort("-createdAt").lean();
};

const getSellerPublicProducts = async (sellerId) => {
  return Product.find({ seller: sellerId, status: "active" }).sort("-createdAt").lean();
};

const markSold = async (productId, sellerId) => {
  const product = await Product.findById(productId);
  if (!product) throw new AppError("Product not found", 404, "NOT_FOUND");
  if (product.seller.toString() !== sellerId.toString()) {
    throw new AppError("Not authorized", 403, "FORBIDDEN");
  }
  if (product.status === "sold") {
    throw new AppError("Product is already sold", 400, "VALIDATION_ERROR");
  }

  product.status = "sold";
  await product.save();

  // Auto-close open inquiries
  await Inquiry.updateMany(
    { product: productId, status: { $in: ["new", "responded"] } },
    { status: "closed" }
  );

  return product;
};

const archive = async (productId, sellerId) => {
  const product = await Product.findById(productId);
  if (!product) throw new AppError("Product not found", 404, "NOT_FOUND");
  if (product.seller.toString() !== sellerId.toString()) {
    throw new AppError("Not authorized", 403, "FORBIDDEN");
  }

  product.status = "archived";
  await product.save();
  return product;
};

const reactivate = async (productId, sellerId) => {
  const product = await Product.findById(productId);
  if (!product) throw new AppError("Product not found", 404, "NOT_FOUND");
  if (product.seller.toString() !== sellerId.toString()) {
    throw new AppError("Not authorized", 403, "FORBIDDEN");
  }
  if (product.status === "active") {
    throw new AppError("Product is already active", 400, "VALIDATION_ERROR");
  }

  product.status = "active";
  await product.save();
  return product;
};

module.exports = {
  create,
  update,
  remove,
  getPublicProducts,
  getBySlug,
  getSellerProducts,
  getSellerPublicProducts,
  markSold,
  archive,
  reactivate,
};
