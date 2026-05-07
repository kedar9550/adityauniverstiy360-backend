const mongoose = require("mongoose");

const SchoolSchema = new mongoose.Schema({
  name: String,
  code: String,
});

module.exports = mongoose.model("Feedback360School", SchoolSchema, "feedback360_schools");