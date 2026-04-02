const router = require("express").Router();
const adminController = require("../controllers/admin.controller");
const { authenticate, authorize } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { mongoIdSchema, adminProductQuerySchema } = require("../validators/common.validators");

router.use(authenticate, authorize("admin"));

// Sellers
router.get("/sellers", adminController.getSellers);
router.get("/sellers/:id", validate(mongoIdSchema, "params"), adminController.getSellerById);
router.patch("/sellers/:id/suspend", validate(mongoIdSchema, "params"), adminController.suspendSeller);
router.patch("/sellers/:id/activate", validate(mongoIdSchema, "params"), adminController.activateSeller);

// Products
router.get("/products", validate(adminProductQuerySchema, "query"), adminController.getProducts);
router.put("/products/:id", validate(mongoIdSchema, "params"), adminController.updateProduct);
router.delete("/products/:id", validate(mongoIdSchema, "params"), adminController.removeProduct);

module.exports = router;
