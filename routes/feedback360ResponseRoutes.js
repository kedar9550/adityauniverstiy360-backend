const express = require("express");
const router = express.Router();

const feedbackController = require("../controllers/feedback360ResponseController");

router.post("/submit", feedbackController.submitFeedback);

module.exports = router;