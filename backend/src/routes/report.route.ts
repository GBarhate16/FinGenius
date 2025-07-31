import express from "express";
import {
  getAllReportsController,
  updateReportSettingController,
} from "../controllers/report.controller";
import { generateReportService } from "../services/report.service";
import { asyncHandler } from "../middlewares/asyncHandler.middlerware";
import { Env } from "../config/env.config";
import ReportModel from "../models/report.model";

const router = express.Router();

router.get("/", getAllReportsController);
router.put("/setting", updateReportSettingController);

// Development route to test report generation
if (Env.NODE_ENV === "development") {
  router.post("/test-generate", asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { from, to } = req.body;
    
    if (!from || !to) {
      return res.status(400).json({
        message: "from and to dates are required",
      });
    }

    const report = await generateReportService(userId, new Date(from), new Date(to));
    
    return res.status(200).json({
      message: "Test report generated",
      data: report,
    });
  }));

  // Development route to create a test report record
  router.post("/test-create-record", asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const now = new Date();
    
    // Create a test report record
    const testReport = await ReportModel.create({
      userId,
      sentDate: now,
      period: "Test Period - Development",
      status: "SENT",
    });
    
    return res.status(200).json({
      message: "Test report record created",
      data: testReport,
    });
  }));
}

export default router;
