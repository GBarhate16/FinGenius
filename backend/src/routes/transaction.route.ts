import { Router } from "express";
import {
  bulkDeleteTransactionController,
  bulkTransactionController,
  createTransactionController,
  deleteTransactionController,
  duplicateTransactionController,
  getAllTransactionController,
  getTransactionByIdController,
  scanReceiptController,
  updateTransactionController,
} from "../controllers/transaction.controller";
import { upload } from "../config/cloudinary.config";
import { Env } from "../config/env.config";
import { genAI } from "../config/google-ai.config";

const transactionRoutes = Router();

transactionRoutes.post("/create", createTransactionController);

transactionRoutes.post(
  "/scan-receipt",
  upload.single("receipt"),
  scanReceiptController
);

transactionRoutes.post("/bulk-transaction", bulkTransactionController);

transactionRoutes.put("/duplicate/:id", duplicateTransactionController);
transactionRoutes.put("/update/:id", updateTransactionController);

transactionRoutes.get("/all", getAllTransactionController);
transactionRoutes.get("/:id", getTransactionByIdController);
transactionRoutes.delete("/delete/:id", deleteTransactionController);
transactionRoutes.delete("/bulk-delete", bulkDeleteTransactionController);

// Development route to check service configuration
if (Env.NODE_ENV === "development") {
  transactionRoutes.get("/config/status", (req, res) => {
    const config = {
      ai: {
        configured: !!genAI,
        message: genAI ? "AI service is configured" : "AI service is not configured (GEMINI_API_KEY missing)"
      },
      cloudinary: {
        configured: !!(Env.CLOUDINARY_CLOUD_NAME && Env.CLOUDINARY_API_KEY && Env.CLOUDINARY_API_SECRET),
        message: (Env.CLOUDINARY_CLOUD_NAME && Env.CLOUDINARY_API_KEY && Env.CLOUDINARY_API_SECRET) 
          ? "Cloudinary is configured" 
          : "Cloudinary is not configured (missing credentials)"
      }
    };
    
    res.json({
      message: "Service configuration status",
      data: config
    });
  });
}

export default transactionRoutes;
