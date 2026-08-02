import mongoose from "mongoose";
import Like from "../models/Like.js";
import Post from "../models/Post.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteImage, uploadImage } from "../utils/cloudinaryUpload.js";
import { sanitizePostContent } from "../utils/content.js";
import { slugify } from "../utils/slug.js";

const populateAuthor = { path: "author", select: "name" };

async function createUniqueSlug(title, excludedPostId) {
  const baseSlug = slugify(title);
  if (!baseSlug) throw new ApiError(400, "Title must contain letters or numbers.");

  let slug = baseSlug;
  let suffix = 2;
  while (await Post.exists({ slug, ...(excludedPostId ? { _id: { $ne: excludedPostId } } : {}) })) {
    slug = `${baseSlug}-${suffix++}`;
  }
  return slug;
}

function validatePostInput({ title, content, status }) {
  if (!title?.trim() || title.trim().length < 3 || title.trim().length > 160) {
    throw new ApiError(400, "Title must be between 3 and 160 characters.");
  }
  if (!content?.trim()) throw new ApiError(400, "Post content is required.");
  if (status !== undefined && !["active", "inactive"].includes(status)) {
    throw new ApiError(400, "Post status must be active or inactive.");
  }
}

function isOwner(post, user) {
  return post.author.toString() === user._id.toString();
}

export const listPosts = asyncHandler(async (req, res) => {
  const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 50);
  const [posts, total] = await Promise.all([
    Post.find({ status: "active" })
      .populate(populateAuthor)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Post.countDocuments({ status: "active" }),
  ]);
  res.json({ posts, page, totalPages: Math.ceil(total / limit), total });
});

export const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug, status: "active" }).populate(populateAuthor);
  if (!post) throw new ApiError(404, "Post not found.");
  res.json({ post });
});

export const createPost = asyncHandler(async (req, res) => {
  const { title, content, status } = req.body;
  validatePostInput({ title, content, status });
  if (!req.file) throw new ApiError(400, "A featured image is required.");

  const uploadedImage = await uploadImage(req.file.buffer);
  try {
    const post = await Post.create({
      title: title.trim(),
      slug: await createUniqueSlug(title),
      content: sanitizePostContent(content),
      status: status || "active",
      featuredImage: { url: uploadedImage.secure_url, publicId: uploadedImage.public_id },
      author: req.user._id,
    });
    await post.populate(populateAuthor);
    res.status(201).json({ post });
  } catch (error) {
    await deleteImage(uploadedImage.public_id).catch(() => undefined);
    throw error;
  }
});

export const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) throw new ApiError(404, "Post not found.");
  if (!isOwner(post, req.user)) throw new ApiError(403, "You can only edit your own posts.");

  const { title, content, status } = req.body;
  validatePostInput({ title: title ?? post.title, content: content ?? post.content, status });
  const oldImageId = post.featuredImage.publicId;
  let uploadedImage;
  if (req.file) uploadedImage = await uploadImage(req.file.buffer);

  try {
    if (title !== undefined) {
      post.title = title.trim();
      post.slug = await createUniqueSlug(title, post._id);
    }
    if (content !== undefined) post.content = sanitizePostContent(content);
    if (status !== undefined) post.status = status;
    if (uploadedImage) post.featuredImage = { url: uploadedImage.secure_url, publicId: uploadedImage.public_id };
    await post.save();
  } catch (error) {
    if (uploadedImage) await deleteImage(uploadedImage.public_id).catch(() => undefined);
    throw error;
  }

  if (uploadedImage) await deleteImage(oldImageId).catch((error) => console.error("Old image cleanup failed", error));
  await post.populate(populateAuthor);
  res.json({ post });
});

export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) throw new ApiError(404, "Post not found.");
  if (!isOwner(post, req.user)) throw new ApiError(403, "You can only delete your own posts.");

  await Promise.all([Like.deleteMany({ post: post._id }), post.deleteOne()]);
  await deleteImage(post.featuredImage.publicId).catch((error) => console.error("Image cleanup failed", error));
  res.status(204).send();
});

export const toggleLike = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.postId)) throw new ApiError(400, "The supplied post ID is invalid.");
  const post = await Post.findById(req.params.postId);
  if (!post || post.status !== "active") throw new ApiError(404, "Post not found.");

  const removedLike = await Like.findOneAndDelete({ user: req.user._id, post: post._id });
  const increment = removedLike ? -1 : 1;
  if (!removedLike) {
    try {
      await Like.create({ user: req.user._id, post: post._id });
    } catch (error) {
      if (error.code === 11000) return res.json({ liked: true, likesCount: post.likesCount });
      throw error;
    }
  }
  const updatedPost = await Post.findByIdAndUpdate(
    post._id,
    { $inc: { likesCount: increment } },
    { new: true }
  );
  res.json({ liked: !removedLike, likesCount: updatedPost.likesCount });
});

export const getLikeStatus = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.postId)) throw new ApiError(400, "The supplied post ID is invalid.");
  const liked = Boolean(await Like.exists({ user: req.user._id, post: req.params.postId }));
  res.json({ liked });
});
