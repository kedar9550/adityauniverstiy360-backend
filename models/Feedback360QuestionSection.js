const mongoose = require("mongoose");

const QuestionSectionSchema = new mongoose.Schema({
    section: { type: String, required: true },

});

module.exports = mongoose.model("Feedback360QuestionSection", QuestionSectionSchema, "feedback360_question_sections");
