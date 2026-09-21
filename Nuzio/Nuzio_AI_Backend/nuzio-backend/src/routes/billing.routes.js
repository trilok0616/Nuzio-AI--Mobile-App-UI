const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { asyncHandler } = require("../utils/asyncHandler");
const {
  getSubscription,
  createCheckoutSession,
  createBillingPortal
} = require("../controllers/billing.controller");

const router = express.Router();

router.use(requireAuth);
router.get("/subscription", asyncHandler(getSubscription));
router.post("/checkout", asyncHandler(createCheckoutSession));
router.post("/portal", asyncHandler(createBillingPortal));

module.exports = router;
