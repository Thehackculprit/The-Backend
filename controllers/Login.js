
const jwt = require("jsonwebtoken");
// REMOVED: The 'Intern' model was imported but not used in this function
// const Intern from "../model/Intern";

const Login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check credentials against environment variables
        const isAdminUser = username === process.env.ADMIN_USERNAME;
        const isAdminPass = password === process.env.ADMIN_PASSWORD;

        if (!isAdminUser || !isAdminPass) {
            // Use 401 for unauthorized access
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // If credentials are correct, generate a JWT token


        console.log('✅ Admin logged in successfully.');
        const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });
        console.log('🔑 JWT Token generated:', token);


        // Send the token back to the frontend
        res.json({
            success: true,
            message: 'Admin login successful',
            token
        });

    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = { Login };