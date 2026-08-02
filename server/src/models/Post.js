import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false }
);

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 160 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    content: { type: String, required: true, maxlength: 100_000 },
    featuredImage: { type: imageSchema, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    likesCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

postSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("Post", postSchema);
