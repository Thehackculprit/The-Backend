const TestimonialData = require("../model/Testimonial"); // Adjust path as needed

const createTestimonial = async (req, res) => {
    try {
        const { name, review, linkedin } = req.body;
        const photoFile = req.file;

        // Validation
        if (!name || !review) {
            return res.status(400).json({ message: "Name and Review fields are required." });
        }
        if (!photoFile) {
            return res.status(400).json({ message: "A profile photo is required." });
        }

        // Construct photo path
        const photoPath = `/uploads/${photoFile.filename}`;

        // Create testimonial
        const newTestimonial = new TestimonialData({
            Name: name,
            Review: review,
            Linkedin: linkedin || "",
            Photo: photoPath
        });

        // Save to DB
        const savedTestimonial = await newTestimonial.save();

        res.status(201).json({
            message: "Testimonial submitted successfully!",
            data: savedTestimonial,
        });

    } catch (error) {
        console.error("❌ Error creating testimonial:", error);
        res.status(500).json({
            message: "An internal server error occurred.",
            error: error.message, // send reason for debugging
        });
    }
};

module.exports = {
    createTestimonial,
};
