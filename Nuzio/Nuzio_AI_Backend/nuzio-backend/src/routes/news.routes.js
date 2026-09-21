const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { asyncHandler } = require("../utils/asyncHandler");
const { listNews, feed } = require("../controllers/news.controller");

const router = express.Router();

router.get("/", requireAuth, asyncHandler(listNews));
router.get("/feed", requireAuth, asyncHandler(feed));

module.exports = router;
