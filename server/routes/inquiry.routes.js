const router = require("express").Router();
const inquiryController = require("../controllers/inquiry.controller");
const { authenticate, authorize } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { createInquirySchema, replySchema } = require("../validators/inquiry.validators");
const { mongoIdSchema, productIdParamSchema } = require("../validators/common.validators");

// Public — buyer creates inquiry without auth
router.post("/", validate(createInquirySchema), inquiryController.create);

// Seller-only
router.get("/seller", authenticate, authorize("seller"), inquiryController.getSellerInquiries);
router.get("/product/:productId", authenticate, authorize("seller"), validate(productIdParamSchema, "params"), inquiryController.getByProduct);
router.get("/:id", authenticate, authorize("seller"), validate(mongoIdSchema, "params"), inquiryController.getById);
router.post("/:id/reply", authenticate, authorize("seller"), validate(mongoIdSchema, "params"), validate(replySchema), inquiryController.reply);
router.patch("/:id/close", authenticate, authorize("seller"), validate(mongoIdSchema, "params"), inquiryController.close);

module.exports = router;
