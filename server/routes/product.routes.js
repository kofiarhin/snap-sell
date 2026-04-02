const router = require("express").Router();
const productController = require("../controllers/product.controller");
const { authenticate, authorize } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { createProductSchema, updateProductSchema } = require("../validators/product.validators");
const { mongoIdSchema, sellerIdParamSchema, slugParamSchema, productQuerySchema, paginationQuerySchema } = require("../validators/common.validators");

// Public
router.get("/", validate(productQuerySchema, "query"), productController.getAll);
router.get("/seller/:sellerId/public", validate(sellerIdParamSchema, "params"), productController.getSellerPublic);

// Seller-only
router.get("/seller/me", authenticate, authorize("seller"), validate(paginationQuerySchema, "query"), productController.getMyProducts);
router.post("/", authenticate, authorize("seller"), validate(createProductSchema), productController.create);
router.put("/:id", authenticate, authorize("seller"), validate(mongoIdSchema, "params"), validate(updateProductSchema), productController.update);
router.delete("/:id", authenticate, authorize("seller"), validate(mongoIdSchema, "params"), productController.remove);
router.patch("/:id/sold", authenticate, authorize("seller"), validate(mongoIdSchema, "params"), productController.markSold);
router.patch("/:id/archive", authenticate, authorize("seller"), validate(mongoIdSchema, "params"), productController.archive);
router.patch("/:id/reactivate", authenticate, authorize("seller"), validate(mongoIdSchema, "params"), productController.reactivate);

// Public slug route (must be last — catches any string param)
router.get("/:slug", validate(slugParamSchema, "params"), productController.getBySlug);

module.exports = router;
