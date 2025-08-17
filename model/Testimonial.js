// ... existing code ...
const mongoose = require("mongoose");
// Corrected schema
const Testimonial = new mongoose.Schema({
    Name: { type: String, required: true },
    Photo: { type: String, required: true },
    Review: { type: String },
    Linkedin: { type: String }, // Assuming it's meant to be a URL or a string
});

// Corrected model name
const TestimonialData = mongoose.models.TestimonialData || mongoose.model('TestimonialData', Testimonial);
module.exports = TestimonialData;

// ... rest of code ...