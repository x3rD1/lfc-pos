const { Router } = require("express");
const router = Router();
const authController = require("./auth.controller");
const validate = require("../../middleware/validator/validate");
const { signupSchema } = require("../../middleware/validator/signupSchema");

router.get("/me", authController.getMe);
router.post("/login", authController.login);
router.post("/signup", validate(signupSchema), authController.signup);
router.post("/logout", authController.logout);

module.exports = router;
