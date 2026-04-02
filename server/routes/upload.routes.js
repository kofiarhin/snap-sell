const router = require("express").Router();
const uploadController = require("../controllers/upload.controller");
const { authenticate } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { z } = require("zod");

const signSchema = z.object({
  intent: z.enum(["profile", "product"], { message: "Intent must be 'profile' or 'product'" }),
});

const publicSignSchema = z.object({
  intent: z.enum(["profile"], { message: "Public uploads only support 'profile'" }),
});

// Authenticated upload signature (profile + product)
router.post("/sign", authenticate, validate(signSchema), uploadController.getSignature);

// Public upload signature (profile only — for registration)
router.post("/sign-public", validate(publicSignSchema), uploadController.getSignature);

module.exports = router;
