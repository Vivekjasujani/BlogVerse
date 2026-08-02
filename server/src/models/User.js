import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, select: false },
    location: { type: String, trim: true, maxlength: 120, default: "Delhi, India" },
    about: { type: String, trim: true, maxlength: 500, default: "Add a short bio about yourself..." },
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  transform: (_document, returned) => {
    delete returned.password;
    delete returned.__v;
    return returned;
  },
});

export default mongoose.model("User", userSchema);
