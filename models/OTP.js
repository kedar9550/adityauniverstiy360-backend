const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
    mobile: {
        type: String,
        required: true,
        trim: true
    },
    otpCode: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: '5m' } // TTL index: documents expire 5 minutes after expiresAt
    }
}, { timestamps: true });

module.exports = mongoose.model("OTP", OTPSchema);
