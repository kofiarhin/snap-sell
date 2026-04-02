const { z } = require("zod");

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(5000),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  COOKIE_NAME: z.string().default("snapsell_token"),
  COOKIE_SECURE: z
    .string()
    .transform((val) => val === "true")
    .default("false"),
  CLIENT_URL: z.string().default("http://localhost:5173"),
  CLIENT_URLS: z.string().optional().default(""),
  CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
  CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
  CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required"),
  MAX_FILE_SIZE_MB: z.coerce.number().default(5),
  BCRYPT_SALT_ROUNDS: z.coerce.number().default(12),
  EMAIL_HOST: z.string().default(""),
  EMAIL_PORT: z.coerce.number().default(587),
  EMAIL_USER: z.string().default(""),
  EMAIL_PASS: z.string().default(""),
  EMAIL_FROM: z.string().default("noreply@snapsell.com"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Environment validation failed:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

module.exports = parsed.data;
