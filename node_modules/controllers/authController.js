const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const OTP = require("../models/OTP");
const axios = require("axios");

// Generate JWT and set cookie
const sendTokenResponse = (user, statusCode, res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || "24h"
    });

    const options = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        httpOnly: true,
        secure: true, // Always true for cross-domain cookies (Required for SameSite=None)
        sameSite: "none"
    };

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};

// @desc    Register admin (For initial setup/testing)
// @route   POST /api/auth/register-admin
exports.registerAdmin = async (req, res) => {
    try {
        const { name, email, mobile, password, role } = req.body;
        const user = await User.create({ name, email, mobile, password, role });
        sendTokenResponse(user, 201, res);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Login admin
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select("+password");

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Logout admin
// @route   GET /api/auth/logout
exports.logout = (req, res) => {
    res.cookie("token", "none", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });

    res.status(200).json({ success: true, message: "Logged out" });
};

// @desc    Forgot Password - Send OTP
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "No user with this email address" });
        }

        const mobile = user.mobile;
        
        // Generate 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

        // Save OTP to DB
        await OTP.create({ mobile, otpCode, expiresAt });

        // Mask mobile number (last 5 digits)
        const maskedMobile = mobile.length > 5 ? "X".repeat(mobile.length - 5) + mobile.slice(-5) : mobile;

        // Send SMS via API
        const name = user.name;
        const mobile_number = mobile;
        const otp = otpCode;
        
        // SMS API URL as provided by user
        const smsApiUrl = `https://pgapi.vispl.in/fe/api/v1/multiSend?username=aditrpg1.trans&password=Ad1tya@1234&unicode=false&from=ADIUNV&to=${mobile_number}&text=Dear+${name},+Thank+you+for+reaching+out+to+us.+To+verify+your+request+and+proceed+with+further+actions,+please+use+the+following+One-Time+Password+(OTP):${otp}+@ADITYA+UNIVERSITY`;

        try {
            await axios.get(smsApiUrl);
            console.log(`[SMS SENT] Mobile: ${mobile}, OTP: ${otpCode}`);
        } catch (smsErr) {
            console.error("[SMS ERROR]", smsErr.message);
        }

        res.status(200).json({ 
            success: true, 
            message: "OTP sent successfully",
            maskedMobile 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Reset Password - Verify OTP
// @route   POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
    const { email, otpCode, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const mobile = user.mobile;
        const otpEntry = await OTP.findOne({ mobile, otpCode });
        if (!otpEntry) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        user.password = newPassword;
        await user.save();

        // Delete OTP after successful reset
        await OTP.deleteOne({ _id: otpEntry._id });

        res.status(200).json({ success: true, message: "Password reset successful" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
    try {
        let token;
        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(200).json({ success: false, message: "No session found" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(200).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        // Token expired or invalid
        res.status(200).json({ success: false, message: "Token expired or invalid" });
    }
};

// @desc    Change Password
// @route   PUT /api/auth/change-password
exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.user.id).select("+password");

        if (!(await user.comparePassword(currentPassword))) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
