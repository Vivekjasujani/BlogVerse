import { Router } from "express";
import {
  createPost,
  deletePost,
  getLikeStatus,
  getPost,
  listPosts,
  toggleLike,
  updatePost,
} from "../controllers/postController.js";
import { authenticate } from "../middleware/authenticate.js";
import { featuredImageUpload } from "../middleware/upload.js";

const router = Router();

router.get("/", listPosts);
router.get("/:slug", getPost);
router.post("/", authenticate, featuredImageUpload, createPost);
router.patch("/:postId", authenticate, featuredImageUpload, updatePost);
router.delete("/:postId", authenticate, deletePost);
router.get("/:postId/like", authenticate, getLikeStatus);
router.post("/:postId/like", authenticate, toggleLike);

export default router;
