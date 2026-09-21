const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { asyncHandler } = require("../utils/asyncHandler");
const { saveArticleSchema } = require("../validators/saved.validators");
const {
  listSaved,
  saveArticle,
  removeSaved
} = require("../controllers/saved.controller");

const router = express.Router();

router.use(requireAuth);
router.get("/", asyncHandler(listSaved));
router.post("/", validate(saveArticleSchema), asyncHandler(saveArticle));
router.delete("/:articleId", asyncHandler(removeSaved));

module.exports = router;
