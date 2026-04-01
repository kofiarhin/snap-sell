const router = require("express").Router();
const productController = require("../controllers/product.controller");
const { authenticate, authorize } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { createProductSchema, updateProductSchema } = require("../validators/product.validators");

// Public
router.get("/", productController.getAll);
router.get("/seller/:sellerId/public", productController.getSellerPublic);

// Seller-only
router.get("/seller/me", authenticate, authorize("seller"), productController.getMyProducts);
router.post("/", authenticate, authorize("seller"), validate(createProductSchema), productController.create);
router.put("/:id", authenticate, authorize("seller"), validate(updateProductSchema), productController.update);
router.delete("/:id", authenticate, authorize("seller"), productController.remove);
router.patch("/:id/sold", authenticate, authorize("seller"), productController.markSold);
router.patch("/:id/archive", authenticate, authorize("seller"), productController.archive);
router.patch("/:id/reactivate", authenticate, authorize("seller"), productController.reactivate);

// Public slug route (must be last — catches any string param)
router.get("/:slug", productController.getBySlug);

module.exports = router;
