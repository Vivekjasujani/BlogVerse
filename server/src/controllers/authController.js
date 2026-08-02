import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cookieOptions, createToken } from "../utils/auth.js";

function sendSession(res, user, statusCode = 200) {
  res
    .status(statusCode)
    .cookie("token", createToken(user._id.toString()), cookieOptions)
    .json({ user });
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name?.trim() || !email?.trim() || !password) {
    throw new ApiError(400, "Name, email, and password are required.");
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new ApiError(400, "Please provide a valid email address.");
  if (password.length < 8) throw new ApiError(400, "Password must be at least 8 characters long.");

  const existingUser = await User.exists({ email: email.toLowerCase() });
  if (existingUser) throw new ApiError(409, "An account with that email already exists.");

  const user = await User.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: await bcrypt.hash(password, 12),
  });
  sendSession(res, user, 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, "Email and password are required.");

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(401, "Incorrect email or password.");
  }
  user.password = undefined;
  sendSession(res, user);
});

export const logout = (_req, res) => {
  res.clearCookie("token", { ...cookieOptions, maxAge: undefined }).status(204).send();
};

export const getCurrentUser = (req, res) => res.json({ user: req.user });
