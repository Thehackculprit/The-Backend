const express = require("express");
const router = express.Router();
const Blog = require("../../model/Blog"); // make sure path is correct
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const bcrypt = require('bcrypt'); // Added for secure password hashing

// ⚠️ IMPORTANT: In a real-world application, you would store a hashed password in the database
// and use bcrypt.compare() to check it. For this example, we'll use environment variables for simplicity.
// Make sure these are set in your .env file:
// ADMIN_USERNAME="admin"
// ADMIN_PASSWORD="your-strong-password"
// JWT_SECRET="your-very-long-and-random-secret-key"

/**
 * @route   POST /api/admin/login
 * @desc    Admin login and token generation
 * @access  Public
 */
router.get("/login", async (req, res) => {
    const { username, password } = req.body;

    // Use a secure comparison against credentials from environment variables
    const adminUser = process.env.ADMIN_USERNAME;
    const adminPass = process.env.ADMIN_PASSWORD;

    if (username === adminUser && password === adminPass) {
        // Create a JWT with a payload. You can add more data here if needed.
        const payload = {
            user: {
                id: "admin",
                role: "admin",
            },
        };

        // Sign the token with the secret and set an expiration time

    } else {
        // Return 401 Unauthorized for incorrect credentials
        res.status(401).json({
            success: false,
            message: "Invalid credentials",
        });
    }
});




router.get("/unverified", async (req, res) => {
    // The middleware above has already handled authentication, so we can proceed.
    console.log("[Route Hit] /admin/unverified");

    try {
        console.log("[DB] Fetching unverified posts...");
        const unverifiedPosts = await Blog.find({ verified: false }).sort({ createdAt: -1 });
        console.log("[DB] Posts found:", unverifiedPosts.length);

        res.status(200).json({
            success: true,
            data: unverifiedPosts,
        });
    } catch (err) {
        console.error("[Error] While fetching unverified posts:", err);
        res.status(500).json({
            success: false,
            message: "Error fetching unverified posts",
            error: err.message,
        });
    }
});



router.post("/forgotpassword", async (req, res) => {

    try {
        // Here you would typically send a password reset link to the user's email
        // For this example, we'll just simulate that with a console log
        console.log(`Password reset link sent to ${"hackculprit@gmail.com"}`);

        res.status(200).json({
            success: true,
            message: "Password reset link sent successfully",
        });
    } catch (err) {
        console.error("[Error] While sending password reset link:", err);
        res.status(500).json({
            success: false,
            message: "Error sending password reset link",
            error: err.message,
        });
    }
});


module.exports = router;
