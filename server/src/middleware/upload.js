import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (allowedMimeTypes.has(file.mimetype)) return callback(null, true);
    callback(new ApiError(400, "Featured image must be a JPG, PNG, GIF, or WebP file."));
  },
});

export const featuredImageUpload = upload.single("image");
