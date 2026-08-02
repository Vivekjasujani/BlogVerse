import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.clientUrls.includes(origin)) return callback(null, true);
      return callback(new Error("This origin is not allowed by CORS."));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: "draft-7", legacyHeaders: false }));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: "draft-7", legacyHeaders: false }), authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/profiles", profileRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
