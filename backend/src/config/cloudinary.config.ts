import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { Env } from "./env.config";
import multer from "multer";

// Only configure Cloudinary if credentials are provided
if (Env.CLOUDINARY_CLOUD_NAME && Env.CLOUDINARY_API_KEY && Env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: Env.CLOUDINARY_CLOUD_NAME,
    api_key: Env.CLOUDINARY_API_KEY,
    api_secret: Env.CLOUDINARY_API_SECRET,
  });
} else {
  console.log("⚠️ Cloudinary not configured - file uploads will not work");
}

const STORAGE_PARAMS = {
  folder: "images",
  allowed_formats: ["jpg", "png", "jpeg"],
  rescource_type: "image" as const,
  quality: "auto:good" as const,
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    ...STORAGE_PARAMS,
  }),
});

export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
  fileFilter: (_, file, cb) => {
    const isValid = /^image\/(jpe?g|png)$/.test(file.mimetype);
    if (!isValid) {
      return;
    }

    cb(null, true);
  },
});
