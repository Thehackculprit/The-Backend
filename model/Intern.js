const mongoose = require("mongoose");

const Application = new mongoose.Schema({
    Name: { type: String, required: true },
    Mail: { type: String, required: true },
    Phone: { type: Number },
    createdAt: { type: Date, default: Date.now },
    College: { type: String },

});

const Intern = mongoose.models.Intern || mongoose.model('Intern', Application);
module.exports = Intern;
