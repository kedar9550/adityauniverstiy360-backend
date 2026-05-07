const express = require("express");
const router = express.Router();

const { getQuestionsByRole, addQuestion, updateQuestion, deleteQuestion } = require("../controllers/feedback360QuestionController");

router.get("/:role", getQuestionsByRole);
router.post("/", addQuestion);
router.put("/:id", updateQuestion);
router.delete("/:id", deleteQuestion);

module.exports = router;