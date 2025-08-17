const Intern = require("../model/Intern");
const XLSX = require("xlsx");
const jwt = require("jsonwebtoken");

const GetMailList = async (req, res) => {
    try {
        // 🔹 Step 1: Check for Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication token required."
            });
        }

        // 🔹 Step 2: Extract token
        const token = authHeader.split(" ")[1];

        // 🔹 Step 3: Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token."
            });
        }

        // 🔹 Step 4: Check if admin
        if (!decoded.isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: Admin privileges required."
            });
        }

        // 🔹 Step 5: Fetch the mail list from DB
        const mailList = await Intern.find({}, "Mail").sort({ createdAt: -1 });

        const data = mailList.map(item => ({
            Email: item.Mail
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Mail List");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=MailList.xlsx"
        );
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        return res.send(excelBuffer);
    } catch (error) {
        console.error("Error fetching mail list:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = { GetMailList };
