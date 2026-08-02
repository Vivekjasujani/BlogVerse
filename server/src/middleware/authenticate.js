import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authenticate = asyncHandler(async (req, _res, next) => {
  const token = req.cookies.token;
  if (!token) throw new ApiError(401, "Please sign in to continue.");

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch {
    throw new ApiError(401, "Your session has expired. Please sign in again.");
  }

  const user = await User.findById(payload.sub);
  if (!user) throw new ApiError(401, "This account no longer exists.");
  req.user = user;
  next();
});
