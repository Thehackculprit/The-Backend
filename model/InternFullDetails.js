const mongoose = require('mongoose');

const InternshipApplicationSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Mail: { type: String, required: true },
    mobile: { type: String, required: true },
    linkedin: { type: String },
    address: { type: String },
    university: { type: String },
    year: { type: String },
    branch: { type: String },
    domain: { type: String },
    introduction: { type: String },
    github: { type: String },
    additionalData: { type: String },
    unpaidWillingness: { type: Boolean, required: true },
    followLinkedin: { type: Boolean, required: true },
    followInstagram: { type: Boolean, required: true },
    terms: { type: Boolean},
    createdAt: { type: Date, default: Date.now }
});


const InternshipApplication = mongoose.models.InternshipApplication || mongoose.model('InternDetails', InternshipApplicationSchema);
module.exports = InternshipApplication;
