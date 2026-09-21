const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { HttpError } = require("../utils/httpError");
const { asyncHandler } = require("../utils/asyncHandler");

const requireAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new HttpError(401, "Authentication required");
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch {
    throw new HttpError(401, "Invalid or expired access token");
  }

  if (payload.type !== "access") {
    throw new HttpError(401, "Invalid token type");
  }

  const user = await User.findById(payload.sub);
  if (!user) throw new HttpError(401, "User no longer exists");

  req.user = user;
  next();
});

module.exports = { requireAuth };
