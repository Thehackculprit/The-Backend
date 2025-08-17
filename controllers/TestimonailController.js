const TestimonialData = require("../model/Testimonial");

const fetchTestimonials = async (req, res) => {
    try {
        const { Name, Photo, Review, Linkedin } = req.body;

        // Validate required fields
        if (!Name || !Photo || !Review || !Linkedin) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Create and save testimonial
        const newTestimonial = new TestimonialData({
            Name,
            Photo,
            Review,
            Linkedin
        });

        await newTestimonial.save(); // ← This actually saves it to MongoDB

        return res.status(201).json({
            success: true,
            message: "Testimonial saved successfully",
            data: newTestimonial
        });

    } catch (e) {
        console.error("Error in FetchTestimonial:", e);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
};

const fetchReviews = async (req, res) => {
    try {
        const testimonials = await TestimonialData.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Testimonials fetched successfully",
            data: testimonials
        });
    } catch (e) {
        console.error("Error in FetchReviews:", e);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
};

module.exports = {
    fetchTestimonials,
    fetchReviews
};
