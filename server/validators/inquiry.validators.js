const { z } = require("zod");

const createInquirySchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  buyerName: z.string().min(1, "Name is required").max(100),
  buyerEmail: z.string().email("Invalid email"),
  buyerPhone: z.string().max(20).optional(),
  message: z.string().min(1, "Message is required").max(2000),
  offerAmount: z.number().min(0).optional(),
});

const replySchema = z.object({
  text: z.string().min(1, "Reply text is required").max(2000),
});

module.exports = { createInquirySchema, replySchema };
