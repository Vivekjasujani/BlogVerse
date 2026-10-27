import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  createPost,
  deletePost,
  getLikeStatus,
  getPost,
  listPosts,
  toggleLike,
  updatePost,
} from "../controllers/postController.js";
import { getPostSummary } from "../controllers/summaryController.js";
import { authenticate } from "../middleware/authenticate.js";
import { featuredImageUpload } from "../middleware/upload.js";

const router = Router();
const summaryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many summary requests. Please try again later." },
});

router.get("/", listPosts);
router.get("/:slug", getPost);
router.get("/:slug/summary", summaryLimiter, getPostSummary);
router.post("/", authenticate, featuredImageUpload, createPost);
router.patch("/:postId", authenticate, featuredImageUpload, updatePost);
router.delete("/:postId", authenticate, deletePost);
router.get("/:postId/like", authenticate, getLikeStatus);
router.post("/:postId/like", authenticate, toggleLike);

export default router;
