const PV = require("../model/PersonValidation");

// --- NEW CONTROLLER FOR CERTIFICATE LOOKUP ---
const lookupCertificate = async (req, res) => {
    try {
        const { id } = req.query; // get id from query string
        if (!id) {
            return res.status(400).json({ message: "Certificate ID (id) is required" });
        }

        if (!/^[A-Za-z0-9-]+$/.test(id)) {
            return res.status(400).json({ message: "Invalid certificate ID format" });
        }

        const certificate = await PV.findOne({ CertificateId: id });  // Use id from query
        if (!certificate) {
            return res.status(404).json({ message: "Certificate not found" });
        }

        res.json({ success: true, data: certificate });  // note: your frontend expects 'data' not 'certificate'
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};





// --- UPDATE YOUR EXPORTS ---
// Make sure to export the new controller alongside the old one.
module.exports = { lookupCertificate };