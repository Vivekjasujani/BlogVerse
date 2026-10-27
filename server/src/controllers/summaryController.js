import crypto from "crypto";
import { env } from "../config/env.js";
import Post from "../models/Post.js";
import { generateSummary } from "../services/aiSummary.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { htmlToPlainText } from "../utils/content.js";

const pendingSummaries = new Map();

function hashContent(post) {
  return crypto.createHash("sha256").update(`${post.title}\n${post.content}`).digest("hex");
}

async function createSummary(post, contentHash) {
  const text = await generateSummary({ title: post.title, text: htmlToPlainText(post.content) });
  const summary = { text, contentHash, model: env.gemini.model, generatedAt: new Date() };
  await Post.updateOne({ _id: post._id }, { $set: { summary } });
  return summary;
}

export const getPostSummary = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug, status: "active" }).select("title content +summary");
  if (!post) throw new ApiError(404, "Post not found.");

  const contentHash = hashContent(post);
  if (post.summary?.text && post.summary.contentHash === contentHash) {
    return res.json({ summary: post.summary.text, generatedAt: post.summary.generatedAt, cached: true });
  }

  const key = `${post._id}:${contentHash}`;
  if (!pendingSummaries.has(key)) {
    pendingSummaries.set(key, createSummary(post, contentHash).finally(() => pendingSummaries.delete(key)));
  }
  const summary = await pendingSummaries.get(key);
  res.json({ summary: summary.text, generatedAt: summary.generatedAt, cached: false });
});
