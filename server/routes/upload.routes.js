const router = require("express").Router();
const uploadController = require("../controllers/upload.controller");
const { authenticate } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { z } = require("zod");

const signSchema = z.object({
  intent: z.enum(["profile", "product"], { message: "Intent must be 'profile' or 'product'" }),
});

router.post("/sign", authenticate, validate(signSchema), uploadController.getSignature);

module.exports = router;
