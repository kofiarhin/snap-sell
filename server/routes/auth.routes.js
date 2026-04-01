const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const { authenticate } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { registerSchema, loginSchema, updateProfileSchema, changePasswordSchema } = require("../validators/auth.validators");

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/logout", authController.logout);
router.get("/me", authenticate, authController.getMe);
router.put("/profile", authenticate, validate(updateProfileSchema), authController.updateProfile);
router.put("/password", authenticate, validate(changePasswordSchema), authController.changePassword);

module.exports = router;
