const mongoose = require("mongoose");

const RoleAssignSchema = new mongoose.Schema({
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Feedback360Role",
        required: true
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Feedback360School"
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Feedback360Department"
    },
    name: {
        type: String,
        required: true
    },
    designation: String,
    empId: {
        type: String,
        trim: true
    },
    active: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model("Feedback360RoleAssignment", RoleAssignSchema);