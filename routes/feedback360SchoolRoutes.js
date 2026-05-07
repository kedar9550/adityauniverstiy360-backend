const express = require("express");
const router = express.Router();

const { getSchools, addSchool, updateSchool, deleteSchool } = require("../controllers/feedback360SchoolController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", getSchools);
router.post("/", protect, authorize("CONFIG_ADMIN"), addSchool);
router.put("/:id", protect, authorize("CONFIG_ADMIN"), updateSchool);
router.delete("/:id", protect, authorize("CONFIG_ADMIN"), deleteSchool);


module.exports = router;