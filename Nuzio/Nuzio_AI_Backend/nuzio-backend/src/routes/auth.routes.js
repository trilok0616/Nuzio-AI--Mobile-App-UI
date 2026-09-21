const express = require("express");
const { validate } = require("../middleware/validate");
const { asyncHandler } = require("../utils/asyncHandler");
const {
  registerSchema,
  loginSchema,
  googleSchema,
  refreshSchema
} = require("../validators/auth.validators");
const {
  register,
  login,
  googleLogin,
  refresh,
  logout
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", validate(registerSchema), asyncHandler(register));
router.post("/login", validate(loginSchema), asyncHandler(login));
router.post("/google", validate(googleSchema), asyncHandler(googleLogin));
router.post("/refresh", validate(refreshSchema), asyncHandler(refresh));
router.post("/logout", validate(refreshSchema), asyncHandler(logout));

module.exports = router;
