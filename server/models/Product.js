const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: 2000,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
      default: 1,
    },
    category: {
      label: { type: String, required: true },
      value: { type: String, required: true },
      slug: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ["active", "sold", "archived", "inactive"],
      default: "active",
      index: true,
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

productSchema.index({ status: 1, "category.slug": 1, createdAt: -1 });
productSchema.index({ seller: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model("Product", productSchema);
