const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
    // Get token from header: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Authentication token required." });
    }

    const token = authHeader.split(" ")[1]; // Extract the token part

    try {
        // Verify the token with your JWT secret key (from .env)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);


        // Optional: you can verify if the decoded token has admin privileges here
        if (!decoded.isAdmin) {
            return res.status(403).json({ success: false, message: "Unauthorized: Admin privileges required." });
        }

        // You can attach the decoded info to req.user for further use in route handlers
        req.user = decoded;

        next(); // Token is valid, proceed
    } catch (err) {
        console.error("JWT verification failed:", err);
        return res.status(401).json({ success: false, message: "Invalid or expired token." });
    }
};

module.exports = {adminAuth};