const express = require("express");
const router = express.Router();

const { getQuestionSections, addQuestionSection, updateQuestionSection, deleteQuestionSection } = require("../controllers/feedback360QuestionSectionController");

router.get("/", getQuestionSections);
router.post("/", addQuestionSection);
router.put("/:id", updateQuestionSection);
router.delete("/:id", deleteQuestionSection);

module.exports = router;
