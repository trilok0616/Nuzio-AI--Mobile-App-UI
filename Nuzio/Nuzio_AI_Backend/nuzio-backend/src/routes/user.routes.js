const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { asyncHandler } = require("../utils/asyncHandler");
const {
  languageLocationSchema,
  professionSchema,
  interestsSchema,
  voiceSchema,
  profileSchema
} = require("../validators/user.validators");
const {
  getMe,
  updateProfile,
  updateLanguageLocation,
  updateProfession,
  updateInterests,
  updateVoice,
  completeOnboarding
} = require("../controllers/user.controller");

const router = express.Router();

router.use(requireAuth);
router.get("/me", asyncHandler(getMe));
router.patch("/me", validate(profileSchema), asyncHandler(updateProfile));
router.patch(
  "/language-location",
  validate(languageLocationSchema),
  asyncHandler(updateLanguageLocation)
);
router.patch("/profession", validate(professionSchema), asyncHandler(updateProfession));
router.patch("/interests", validate(interestsSchema), asyncHandler(updateInterests));
router.patch("/voice", validate(voiceSchema), asyncHandler(updateVoice));
router.post("/onboarding/complete", asyncHandler(completeOnboarding));

module.exports = router;
