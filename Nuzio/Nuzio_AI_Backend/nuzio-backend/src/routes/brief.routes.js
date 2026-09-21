const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { asyncHandler } = require("../utils/asyncHandler");
const { todayBrief } = require("../controllers/brief.controller");

const router = express.Router();

router.get("/today", requireAuth, asyncHandler(todayBrief));

module.exports = router;
