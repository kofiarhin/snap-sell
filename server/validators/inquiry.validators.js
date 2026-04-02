const { z } = require("zod");

const createInquirySchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  buyerName: z.string().min(1, "Name is required").max(100),
  buyerEmail: z.string().email("Invalid email"),
  buyerPhone: z
    .string()
    .trim()
    .regex(/^[+]?[0-9()\\-\\s]{7,20}$/, "Invalid phone number")
    .optional(),
  message: z.string().min(1, "Message is required").max(2000),
  offerAmount: z.coerce.number().min(0).optional(),
}).strict();

const replySchema = z.object({
  text: z.string().min(1, "Reply text is required").max(2000),
}).strict();

module.exports = { createInquirySchema, replySchema };
