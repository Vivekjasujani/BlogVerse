import cloudinary from "../config/cloudinary.js";

export function uploadImage(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "blogverse/posts", resource_type: "image" },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });
}

export async function deleteImage(publicId) {
  if (publicId) await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
}
