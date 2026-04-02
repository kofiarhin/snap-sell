const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderType: {
      type: String,
      enum: ["buyer", "seller"],
      required: true,
    },
    text: {
      type: String,
      required: [true, "Message text is required"],
      maxlength: 2000,
    },
  },
  { timestamps: true }
);

const inquirySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    buyer: {
      name: { type: String, required: [true, "Buyer name is required"] },
      email: { type: String, required: [true, "Buyer email is required"] },
      phone: { type: String, default: "" },
    },
    offerAmount: {
      type: Number,
      min: 0,
    },
    status: {
      type: String,
      enum: ["new", "responded", "closed"],
      default: "new",
      index: true,
    },
    messages: [messageSchema],
  },
  { timestamps: true }
);

inquirySchema.index({ seller: 1, createdAt: -1 });
inquirySchema.index({ product: 1, createdAt: -1 });

module.exports = mongoose.model("Inquiry", inquirySchema);
