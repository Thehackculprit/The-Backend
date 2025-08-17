const express = require("express");
const bcrypt = require('bcryptjs');
const { Resend } = require('resend');
const User = require('../../model/User');
const router = express.Router();
const Blog = require("../../model/Blog");
const crypto = require('crypto');
const {adminAuth} = require("../../middleware/auth");
const jwt = require("jsonwebtoken");


const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Middleware for basic admin authentication.
 * It now securely compares credentials against values stored in the .env file.
 */



/**
 * Route to verify a blog post.
 * This route is now protected by the improved adminAuth middleware.
 */
router.patch("/unverified/:id", adminAuth, async (req, res) => {
    console.log("🟢 [Verification] Received PATCH request for ID:", req.params.id);


    try {
        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            { verified: true }, // The update to be applied
            { new: true }      // This option returns the updated document
        );

        if (!blog) {
            console.log("❌ [Verification] Blog not found with ID:", req.params.id);
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        console.log(`✅ Blog ${blog._id} verified by admin: ${req.user.userId}`);
        console.log("✅ [Verification] Blog verified successfully:", blog._id);
        res.status(200).json({ success: true, message: "Marked as verified", data: blog });

    } catch (err) {
        console.error("❌ [Verification] Error verifying blog:", err);
        res.status(500).json({ success: false, message: "Failed to update verification status.", error: err.message });
    }
});



// Use environment variables or hardcode for demo (use dotenv in real apps)



// forgot password controller
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Find the admin user in the database by their name
        const adminUser = await User.findOne({ name: username, isAdmin: true });

        // If no user is found with that name, log it and exit
        if (!adminUser) {
            // This log tells YOU the username was wrong
            console.error(`❌ Login failed: No admin user found with name '${username}'`);
            return res.status(401).json({ message: "Invalid admin credentials" });
        }

        // 2. If user is found, compare the submitted password with the stored hash
        const isMatch = await bcrypt.compare(password, adminUser.password);

        // If the passwords do not match, log it and exit
        if (!isMatch) {
            // This log tells YOU the password was wrong
            console.error(`❌ Login failed: Incorrect password for admin '${username}'`);
            return res.status(401).json({ message: "Invalid admin credentials" });
        }

        // 3. If everything matches, create the JWT token
        const token = jwt.sign(
            { userId: adminUser._id, username: adminUser.name, isAdmin: true },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        console.log(`✅ Admin '${username}' logged in successfully`);
        return res.json({ token });
    } catch (err) {
        console.error("❌ Admin login server error:", err);
        return res.status(500).json({ message: "Server error during login." });
    }
});
// POST /recover-password -> Corrected path and uses imported modules
// The final URL will be something like /api/admin/recover-password
router.post("/recover-password", async (req, res) => {
    try {
        const adminEmail = "hackculprit@gmail.com";
        const adminUser = await User.findOne({ email: adminEmail });

        if (!adminUser) {
            console.error("CRITICAL: The hardcoded admin email was not found in the database.");
            return res.status(500).json({ message: "Admin account configuration error." });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        adminUser.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        adminUser.passwordResetExpires = Date.now() + 10 * 60 * 1000;
        await adminUser.save();

        const resetURL = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

        await resend.emails.send({
            from: 'Hack Culprit <noreply@hackculprit.live>', // Ensure this domain is verified
            to: adminEmail,
            subject: 'Admin Account Password Reset For Hack Culprit',
            html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff; color: #333;">
  
  <h2 style="color: #1a73e8; margin-top: 0;">Password Reset Request</h2>
  
  <p style="font-size: 16px; line-height: 1.5;">
    We received a request to reset the password associated with your admin account.  
    If you made this request, please click the button below to set a new password.
  </p>
  
  <p style="text-align: center; margin: 30px 0;">
    <a href="${resetURL}" style="background-color: #1a73e8; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 16px; display: inline-block;">
      Reset Your Password
    </a>
  </p>
  
  <p style="font-size: 14px; line-height: 1.5; color: #555;">
    If you did not request a password reset, please ignore this email. Your account will remain secure.  
    For assistance, contact our support team.
  </p>
  
  <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
  
  <p style="font-size: 12px; color: #999; text-align: center;">
    &copy; ${new Date().getFullYear()} Hack Culprit. All rights reserved.  
    This is an automated message — please do not reply.
  </p>
</div>
`
        });

        console.log("API Key being u    sed by server:", process.env.RESEND_API_KEY);


        res.status(200).json({ message: "Admin password reset link has been sent." });

    } catch (err) {
        // This logs the full error to your terminal, which is always important
        console.error("[Error] in admin password recovery:", err);

        // --- IMPROVED ERROR HANDLING ---
        // Check if the environment is production
        if (process.env.NODE_ENV === 'production') {
            // In production, send a generic, safe message
            res.status(500).json({ message: "An internal server error occurred." });
        } else {
            // In development, send a detailed error message back
            res.status(500).json({
                message: "An error occurred during password recovery.",
                error: err.message, // The specific error message from Resend, DB, etc.
                stack: err.stack    // The stack trace (optional, but very helpful)
            });
        }
    }

});


// POST /resetpassword/:token
// This route handles the final step of the password reset.
router.post("/resetpassword/:token", async (req, res) => {
    try {
        // 1. Get the un-hashed token from the URL parameters
        const resetToken = req.params.token;

        // 2. Hash this token to safely find it in the database
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // 3. Find the user with this token that has not expired
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        // 4. If no user is found, the token is invalid or expired
        if (!user) {
            return res.status(400).json({ message: "Password reset token is invalid or has expired." });
        }

        // 5. Get and validate the new password from the request body
        const { password } = req.body;
        if (!password || password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long." });
        }

        // 6. Hash the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // 7. Clear the reset token fields to prevent reuse
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        // 8. Save the updated user to the database
        await user.save();

        // 9. Send a final success message
        res.status(200).json({ message: "Password has been updated successfully." });

    } catch (err) {
        // This will always log the full error to your private terminal
        console.error("[Error] in /resetpassword route:", err);

        // --- IMPROVED ERROR HANDLING ---
        if (process.env.NODE_ENV === 'production') {
            // In production, send a generic, safe message
            res.status(500).json({ message: "An internal server error occurred." });
        } else {
            // In development, send the detailed error back to you
            res.status(500).json({
                message: "An error occurred while resetting the password.",
                error: err.message,
                stack: err.stack
            });
        }
    }
});
module.exports = router;
