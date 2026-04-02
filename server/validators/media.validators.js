const { z } = require("zod");
const env = require("../config/env");

const cloudinaryHostPattern = new RegExp(`^https://res\\.cloudinary\\.com/${env.CLOUDINARY_CLOUD_NAME}/`, "i");
const publicIdPattern = /^snapsell\/(profiles|products)\/[A-Za-z0-9_\/-]+$/;

const imageSchema = z.object({
  url: z
    .string()
    .url("Invalid image URL")
    .refine((value) => cloudinaryHostPattern.test(value), {
      message: "Image URL must be a Cloudinary URL for this cloud",
    }),
  publicId: z
    .string()
    .min(1, "Public ID is required")
    .max(255, "Public ID is too long")
    .regex(publicIdPattern, "Invalid Cloudinary public ID"),
});

module.exports = { imageSchema };
