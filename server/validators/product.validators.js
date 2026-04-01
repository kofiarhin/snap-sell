const { z } = require("zod");

const imageSchema = z.object({
  url: z.string().url("Invalid image URL"),
  publicId: z.string().min(1, "Public ID is required"),
});

const createProductSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required").max(2000),
  price: z.number().min(0, "Price cannot be negative"),
  quantity: z.number().int().min(0, "Quantity cannot be negative").default(1),
  category: z.string().min(1, "Category is required"),
  images: z.array(imageSchema).min(1, "At least one image is required"),
});

const updateProductSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(2000).optional(),
  price: z.number().min(0).optional(),
  quantity: z.number().int().min(0).optional(),
  category: z.string().min(1).optional(),
  images: z.array(imageSchema).min(1).optional(),
});

module.exports = { createProductSchema, updateProductSchema };
