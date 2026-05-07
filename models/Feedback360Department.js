const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  code: {
    type: String,
    required: true
  },

  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Feedback360School",
    required: true
  }

});

module.exports = mongoose.model("Feedback360Department", DepartmentSchema, "feedback360_departments");