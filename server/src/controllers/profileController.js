import User from "../models/User.js";
import Post from "../models/Post.js";
import Like from "../models/Like.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) throw new ApiError(404, "User not found.");
  const [postsCount, likesCount] = await Promise.all([
    Post.countDocuments({ author: user._id, status: "active" }),
    Like.countDocuments({ user: user._id }),
  ]);
  res.json({ user, stats: { postsCount, likesCount } });
});

export const updateMyProfile = asyncHandler(async (req, res) => {
  const { location, about } = req.body;
  if (location !== undefined) {
    if (typeof location !== "string" || location.trim().length > 120) {
      throw new ApiError(400, "Location must be 120 characters or fewer.");
    }
    req.user.location = location.trim();
  }
  if (about !== undefined) {
    if (typeof about !== "string" || about.trim().length > 500) {
      throw new ApiError(400, "About section must be 500 characters or fewer.");
    }
    req.user.about = about.trim();
  }
  await req.user.save();
  res.json({ user: req.user });
});

export const getUserPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ author: req.params.userId, status: "active" })
    .populate("author", "name")
    .sort({ createdAt: -1 });
  res.json({ posts });
});

export const getMyLikedPosts = asyncHandler(async (req, res) => {
  const likes = await Like.find({ user: req.user._id })
    .populate({ path: "post", match: { status: "active" }, populate: { path: "author", select: "name" } })
    .sort({ createdAt: -1 });
  res.json({ posts: likes.map((like) => like.post).filter(Boolean) });
});
