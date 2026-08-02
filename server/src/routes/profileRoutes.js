import { Router } from "express";
import { getMyLikedPosts, getProfile, getUserPosts, updateMyProfile } from "../controllers/profileController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

router.patch("/me", authenticate, updateMyProfile);
router.get("/me/liked-posts", authenticate, getMyLikedPosts);
router.get("/:userId/posts", getUserPosts);
router.get("/:userId", getProfile);

export default router;
