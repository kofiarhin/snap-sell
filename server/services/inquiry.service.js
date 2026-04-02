const Inquiry = require("../models/Inquiry");
const Product = require("../models/Product");
const AppError = require("../utils/AppError");

const create = async (data) => {
  const product = await Product.findById(data.productId);
  if (!product) throw new AppError("Product not found", 404, "NOT_FOUND");
  if (product.status !== "active") {
    throw new AppError("Cannot inquire about this product", 400, "VALIDATION_ERROR");
  }

  const inquiry = await Inquiry.create({
    product: product._id,
    seller: product.seller,
    buyer: {
      name: data.buyerName,
      email: data.buyerEmail,
      phone: data.buyerPhone || "",
    },
    offerAmount: data.offerAmount,
    messages: [
      {
        senderType: "buyer",
        text: data.message,
      },
    ],
  });

  return inquiry;
};

const getSellerInquiries = async (sellerId, query = {}) => {
  const { page = 1, limit = 12, search, sort = "-createdAt" } = query;
  const filter = { seller: sellerId };

  if (search) {
    filter.$or = [
      { "buyer.name": { $regex: search, $options: "i" } },
      { "buyer.email": { $regex: search, $options: "i" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [inquiries, total] = await Promise.all([
    Inquiry.find(filter)
      .populate("product", "title slug images status")
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Inquiry.countDocuments(filter),
  ]);

  return {
    inquiries,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  };
};

const getByProduct = async (productId, sellerId, query = {}) => {
  const product = await Product.findById(productId);
  if (!product) throw new AppError("Product not found", 404, "NOT_FOUND");
  if (product.seller.toString() !== sellerId.toString()) {
    throw new AppError("Not authorized", 403, "FORBIDDEN");
  }

  const { page = 1, limit = 12, sort = "-createdAt" } = query;
  const filter = { product: productId };
  const skip = (Number(page) - 1) * Number(limit);
  const [inquiries, total] = await Promise.all([
    Inquiry.find(filter).sort(sort).skip(skip).limit(Number(limit)).lean(),
    Inquiry.countDocuments(filter),
  ]);

  return {
    inquiries,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  };
};

const getById = async (inquiryId, sellerId) => {
  const inquiry = await Inquiry.findById(inquiryId)
    .populate("product", "title slug images status price");
  if (!inquiry) throw new AppError("Inquiry not found", 404, "NOT_FOUND");
  if (inquiry.seller.toString() !== sellerId.toString()) {
    throw new AppError("Not authorized", 403, "FORBIDDEN");
  }
  return inquiry;
};

const reply = async (inquiryId, sellerId, text) => {
  const inquiry = await Inquiry.findById(inquiryId);
  if (!inquiry) throw new AppError("Inquiry not found", 404, "NOT_FOUND");
  if (inquiry.seller.toString() !== sellerId.toString()) {
    throw new AppError("Not authorized", 403, "FORBIDDEN");
  }
  if (inquiry.status === "closed") {
    throw new AppError("Inquiry is closed", 400, "VALIDATION_ERROR");
  }

  inquiry.messages.push({ senderType: "seller", text });
  inquiry.status = "responded";
  await inquiry.save();
  return inquiry;
};

const close = async (inquiryId, sellerId) => {
  const inquiry = await Inquiry.findById(inquiryId);
  if (!inquiry) throw new AppError("Inquiry not found", 404, "NOT_FOUND");
  if (inquiry.seller.toString() !== sellerId.toString()) {
    throw new AppError("Not authorized", 403, "FORBIDDEN");
  }

  inquiry.status = "closed";
  await inquiry.save();
  return inquiry;
};

module.exports = { create, getSellerInquiries, getByProduct, getById, reply, close };
