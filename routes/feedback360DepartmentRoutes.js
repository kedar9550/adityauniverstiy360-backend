const express = require("express");
const router = express.Router();

const { getDepartments, addDepartment, updateDepartment, deleteDepartment } = require("../controllers/feedback360DepartmentController");

router.get("/:schoolId", getDepartments);
router.post("/", addDepartment);
router.put("/:id", updateDepartment);
router.delete("/:id", deleteDepartment);

module.exports = router;