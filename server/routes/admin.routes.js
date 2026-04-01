const router = require("express").Router();
const adminController = require("../controllers/admin.controller");
const { authenticate, authorize } = require("../middleware/auth");

router.use(authenticate, authorize("admin"));

// Sellers
router.get("/sellers", adminController.getSellers);
router.get("/sellers/:id", adminController.getSellerById);
router.patch("/sellers/:id/suspend", adminController.suspendSeller);
router.patch("/sellers/:id/activate", adminController.activateSeller);

// Products
router.get("/products", adminController.getProducts);
router.put("/products/:id", adminController.updateProduct);
router.delete("/products/:id", adminController.removeProduct);

module.exports = router;
