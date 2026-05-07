const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({

  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Feedback360School",
    required: true
  },

  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Feedback360Department",
    default: null
  },

  designation: {
    type: String,
    trim: true
  },

  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Feedback360Role",
    required: true
  },

  round: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Feedback360Round",
    required: true
  },

  ipAddress: {
    type: String,
    trim: true
  },

  browserSignature: {
    type: String,
    trim: true
  },

  ratingAnswers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Feedback360Question",
        required: true
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
      }
    }
  ],

  textAnswers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Feedback360Question"
      },
      answer: {
        type: String,
        trim: true
      }
    }
  ],

  targetPersonName: {
    type: String,
    trim: true
  },
  empId: {
    type: String,
    trim: true
  },

  giverRole: {
    type: String,
    trim: true
  },

  submittedAt: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });


/* indexes for reports */

FeedbackSchema.index({ role: 1 });
FeedbackSchema.index({ school: 1 });
FeedbackSchema.index({ department: 1 });
FeedbackSchema.index({ role: 1, department: 1 });
FeedbackSchema.index({ role: 1, school: 1 });
FeedbackSchema.index({ round: 1 });
FeedbackSchema.index({ giverRole: 1 });

module.exports = mongoose.model("Feedback360Response", FeedbackSchema, "feedback360_responses");