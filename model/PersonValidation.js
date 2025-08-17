const mongoose = require("mongoose");

const PersonValidationSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Domain: { type: String, required: true },
    CertificateId: { type: String },
    createdAt: { type: Date, default: Date.now },
    Course: { type: Boolean, default: false},
    Internship: { type: Boolean, default: false }
});

const PV = mongoose.models.PV || mongoose.model('PersonValidationSchema', PersonValidationSchema);
module.exports = PV;
