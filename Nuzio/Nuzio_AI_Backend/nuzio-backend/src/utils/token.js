const crypto = require("crypto");
const jwt = require("jsonwebtoken");

function signAccessToken(userId) {
  if (!process.env.JWT_ACCESS_SECRET) throw new Error("JWT_ACCESS_SECRET is missing");
  return jwt.sign(
    { sub: String(userId), type: "access" },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_TTL || "15m" }
  );
}

function createRefreshTokenValue() {
  return crypto.randomBytes(48).toString("hex");
}

function hashToken(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function refreshExpiryDate() {
  const days = Number(process.env.REFRESH_TOKEN_TTL_DAYS || 30);
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

function articleIdFromUrl(url) {
  return crypto.createHash("sha256").update(String(url)).digest("hex").slice(0, 24);
}

module.exports = {
  signAccessToken,
  createRefreshTokenValue,
  hashToken,
  refreshExpiryDate,
  articleIdFromUrl
};
