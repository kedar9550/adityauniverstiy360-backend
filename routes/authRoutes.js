const express = require("express");
const { check } = require("express-validator");
const {
    registerAdmin,
    login,
    logout,
    forgotPassword,
    resetPassword,
    getMe,
    changePassword
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// @desc    Register admin (For initial setup/testing)
// @route   POST /api/auth/register-admin
router.post("/register-admin", registerAdmin);

// @desc    Login admin
// @route   POST /api/auth/login
router.post("/login", [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists()
], login);

// @desc    Logout admin
// @route   GET /api/auth/logout
router.get("/logout", logout);

// @desc    Forgot Password - Send OTP
// @route   POST /api/auth/forgot-password
router.post("/forgot-password", forgotPassword);

// @desc    Reset Password - Verify OTP
// @route   POST /api/auth/reset-password
router.post("/reset-password", resetPassword);

// @desc    Get current user
// @route   GET /api/auth/me
router.get("/me", getMe);

// @desc    Change Password
// @route   PUT /api/auth/change-password
router.put("/change-password", protect, changePassword);

module.exports = router;
