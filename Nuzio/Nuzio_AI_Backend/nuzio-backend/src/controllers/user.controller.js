async function getMe(req, res) {
  res.json({ success: true, user: req.user.toSafeObject() });
}

async function updateProfile(req, res) {
  if (req.body.name !== undefined) req.user.name = req.body.name;

  if (req.body.notifications) {
    req.user.notifications = {
      ...req.user.notifications.toObject(),
      ...req.body.notifications
    };
  }

  await req.user.save();
  res.json({ success: true, user: req.user.toSafeObject() });
}

async function updateLanguageLocation(req, res) {
  req.user.language = req.body.language;
  req.user.locationPermission = req.body.locationPermission;

  if (req.body.location) {
    req.user.location = {
      ...req.user.location.toObject(),
      ...req.body.location
    };
  }

  await req.user.save();
  res.json({ success: true, user: req.user.toSafeObject() });
}

async function updateProfession(req, res) {
  req.user.profession = req.body.profession;
  await req.user.save();
  res.json({ success: true, user: req.user.toSafeObject() });
}

async function updateInterests(req, res) {
  req.user.interests = [...new Set(req.body.interests.map((x) => x.trim()))];
  await req.user.save();
  res.json({ success: true, user: req.user.toSafeObject() });
}

async function updateVoice(req, res) {
  req.user.voicePreference = req.body.voice;
  await req.user.save();
  res.json({ success: true, user: req.user.toSafeObject() });
}

async function completeOnboarding(req, res) {
  if (!req.user.profession || req.user.interests.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Profession and at least one interest are required before completing onboarding"
    });
  }

  req.user.onboardingCompleted = true;
  await req.user.save();

  res.json({ success: true, user: req.user.toSafeObject() });
}

module.exports = {
  getMe,
  updateProfile,
  updateLanguageLocation,
  updateProfession,
  updateInterests,
  updateVoice,
  completeOnboarding
};
