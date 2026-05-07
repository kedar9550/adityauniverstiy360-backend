const mongoose = require("mongoose");
const QuestionSchema = new mongoose.Schema({

  section: { type: mongoose.Schema.Types.ObjectId, ref: "Feedback360QuestionSection", required: true },

  role: { type: mongoose.Schema.Types.ObjectId, ref: "Feedback360Role", required: true },

  type: {
    type: String,
    enum: ["rating", "text"],
    required: true
  },

  question: { type: String, required: true },

  order: { type: Number, required: true }

});
QuestionSchema.index({ role: 1 });

module.exports = mongoose.model("Feedback360Question", QuestionSchema, "feedback360_questions");