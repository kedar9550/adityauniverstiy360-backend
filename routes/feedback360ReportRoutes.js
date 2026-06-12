const express = require("express");
const router = express.Router();

const reportController = require("../controllers/feedback360ReportController");


const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/dashboard-stats", protect, authorize("REPORT_ADMIN"), reportController.getDashboardStats);
router.get("/", protect, authorize("REPORT_ADMIN"), reportController.getReport);
router.get("/compare", protect, authorize("REPORT_ADMIN"), reportController.getRoundComparison);


module.exports = router;