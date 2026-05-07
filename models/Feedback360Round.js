const mongoose = require("mongoose");

const FeedbackRoundSchema = new mongoose.Schema({
  academicYear: {
    type: String,
    required: true,
    trim: true
  },
  cycle: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  round: {
    type: Number,
    required: true,
    unique: true,
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Compound index to ensure uniqueness of academic year and cycle
FeedbackRoundSchema.index({ academicYear: 1, cycle: 1 }, { unique: true });

module.exports = mongoose.model(
  "Feedback360Round",
  FeedbackRoundSchema,
  "feedback360_rounds"
);
