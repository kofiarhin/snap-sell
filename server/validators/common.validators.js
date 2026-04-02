const { z } = require("zod");

const mongoIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
});

const sellerIdParamSchema = z.object({
  sellerId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid seller ID format"),
});

const productIdParamSchema = z.object({
  productId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID format"),
});

const slugParamSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
});

const tokenParamSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
  search: z.string().optional(),
  sort: z.string().optional(),
  status: z.enum(["active", "sold", "archived", "inactive"]).optional(),
});

const productQuerySchema = paginationQuerySchema.extend({
  category: z.string().optional(),
  status: z.enum(["active", "sold", "archived", "inactive"]).optional(),
  seller: z.string().optional(),
});

const adminProductQuerySchema = paginationQuerySchema.extend({
  category: z.string().optional(),
  status: z.enum(["active", "sold", "archived", "inactive"]).optional(),
  seller: z.string().optional(),
}).transform((data) => ({ ...data, limit: data.limit || 20 }));

module.exports = {
  mongoIdSchema,
  sellerIdParamSchema,
  productIdParamSchema,
  slugParamSchema,
  tokenParamSchema,
  paginationQuerySchema,
  productQuerySchema,
  adminProductQuerySchema,
};
