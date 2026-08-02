import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, "../../.env");
dotenv.config({ path: envPath });

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  clientUrls: (process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean),
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
};

export function validateEnvironment() {
  const required = ["mongoUri", "jwtSecret", "cloudinary.cloudName", "cloudinary.apiKey", "cloudinary.apiSecret"];
  const missing = required.filter((key) => {
    const value = key.split(".").reduce((current, part) => current?.[part], env);
    return !value;
  });

  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}
