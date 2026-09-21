const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");

const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const { HttpError } = require("../utils/httpError");
const {
  signAccessToken,
  createRefreshTokenValue,
  hashToken,
  refreshExpiryDate
} = require("../utils/token");

async function issueSession(user) {
  const accessToken = signAccessToken(user._id);
  const refreshToken = createRefreshTokenValue();

  await RefreshToken.create({
    user: user._id,
    tokenHash: hashToken(refreshToken),
    expiresAt: refreshExpiryDate()
  });

  return { accessToken, refreshToken };
}

async function register(req, res) {
  const { name, email, password } = req.body;

  if (await User.exists({ email })) {
    throw new HttpError(409, "An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash });
  const tokens = await issueSession(user);

  res.status(201).json({
    success: true,
    user: user.toSafeObject(),
    ...tokens
  });
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+passwordHash");

  if (!user || !user.passwordHash) {
    throw new HttpError(401, "Invalid email or password");
  }

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) throw new HttpError(401, "Invalid email or password");

  const tokens = await issueSession(user);

  res.json({
    success: true,
    user: user.toSafeObject(),
    ...tokens
  });
}

async function googleLogin(req, res) {
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new HttpError(503, "Google Sign-In is not configured");
  }

  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken: req.body.idToken,
    audience: process.env.GOOGLE_CLIENT_ID
  });

  const payload = ticket.getPayload();

  if (!payload?.email || !payload.email_verified) {
    throw new HttpError(401, "Google account email is not verified");
  }

  let user = await User.findOne({
    $or: [{ googleSub: payload.sub }, { email: payload.email.toLowerCase() }]
  });

  if (!user) {
    user = await User.create({
      name: payload.name || "Nuzio User",
      email: payload.email.toLowerCase(),
      googleSub: payload.sub
    });
  } else if (!user.googleSub) {
    user.googleSub = payload.sub;
    if (!user.name && payload.name) user.name = payload.name;
    await user.save();
  }

  const tokens = await issueSession(user);

  res.json({
    success: true,
    user: user.toSafeObject(),
    ...tokens
  });
}

async function refresh(req, res) {
  const tokenHash = hashToken(req.body.refreshToken);
  const stored = await RefreshToken.findOne({ tokenHash }).populate("user");

  if (!stored || stored.expiresAt <= new Date() || !stored.user) {
    throw new HttpError(401, "Invalid or expired refresh token");
  }

  await stored.deleteOne();
  const tokens = await issueSession(stored.user);

  res.json({ success: true, ...tokens });
}

async function logout(req, res) {
  await RefreshToken.deleteOne({ tokenHash: hashToken(req.body.refreshToken) });
  res.json({ success: true, message: "Logged out" });
}

module.exports = { register, login, googleLogin, refresh, logout };
