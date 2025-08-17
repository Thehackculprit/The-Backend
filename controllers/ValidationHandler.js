const PV = require("../model/PersonValidation");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;


const ValidationHandler = async (req, res) => {
    try {
        const { Name, Domain, CertificateId, Course, referenceNumber } = req.body;

        if (!Name || !Domain) {
            return res.status(400).json({ error: "Name and Domain are required" });
        }

        const newEntry = new PV({ Name, Domain, CertificateId, Course, referenceNumber });

        await newEntry.save();

        res.status(201).json({
            success: true,
            message: "Validation entry saved successfully",
            data: newEntry,
        });
    } catch (error) {
        console.error("Error in ValidationHandler:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

module.exports = { ValidationHandler };
