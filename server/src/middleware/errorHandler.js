import multer from "multer";

export function notFoundHandler(req, _res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

export function errorHandler(error, _req, res, _next) {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Something went wrong.";

  if (error.name === "CastError") {
    statusCode = 400;
    message = "The supplied resource ID is invalid.";
  }
  if (error.code === 11000) {
    statusCode = 409;
    message = "That value is already in use.";
  }
  if (error instanceof multer.MulterError) {
    statusCode = 400;
    message = error.code === "LIMIT_FILE_SIZE" ? "Featured image must be 5 MB or smaller." : error.message;
  }

  if (statusCode >= 500) console.error(error);
  res.status(statusCode).json({ message, details: error.details });
}
