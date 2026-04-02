const router = require("express").Router();
const inquiryController = require("../controllers/inquiry.controller");
const { authenticate, authorize } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { createInquirySchema, replySchema } = require("../validators/inquiry.validators");
const { mongoIdSchema, paginationQuerySchema, productIdParamSchema } = require("../validators/common.validators");
const { createRateLimiter } = require("../middleware/security");

const inquiryCreateLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: "Too many inquiries submitted. Please wait before trying again.",
});

const inquiryReplyLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 60,
  message: "Too many replies sent. Please wait before trying again.",
});

// Public — buyer creates inquiry without auth
router.post("/", inquiryCreateLimiter, validate(createInquirySchema), inquiryController.create);

// Seller-only
router.get("/seller", authenticate, authorize("seller"), validate(paginationQuerySchema, "query"), inquiryController.getSellerInquiries);
router.get("/product/:productId", authenticate, authorize("seller"), validate(productIdParamSchema, "params"), validate(paginationQuerySchema, "query"), inquiryController.getByProduct);
router.get("/:id", authenticate, authorize("seller"), validate(mongoIdSchema, "params"), inquiryController.getById);
router.post("/:id/reply", inquiryReplyLimiter, authenticate, authorize("seller"), validate(mongoIdSchema, "params"), validate(replySchema), inquiryController.reply);
router.patch("/:id/close", authenticate, authorize("seller"), validate(mongoIdSchema, "params"), inquiryController.close);

module.exports = router;
