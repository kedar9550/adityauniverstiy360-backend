const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/feedback360AssignmentController");

router.get("/all", assignmentController.getAllAssignments);
router.post("/", assignmentController.createOrUpdateAssignment);
router.delete("/:id", assignmentController.deleteAssignment);

module.exports = router;
