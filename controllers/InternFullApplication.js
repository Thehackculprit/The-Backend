const InternshipApplication = require('../model/InternFullDetails');


const submitApplication = async (req, res) => {
    try {
        const {
            Name,
            Mail,
            mobile,
            linkedin,
            address,
            university,
            year,
            branch,
            domain,
            introduction,
            github,
            additionalData,
            unpaidWillingness,
            followLinkedin,
            followInstagram,
            terms
        } = req.body;

        const missingFields = [];

        const requiredFields = {
            Name,
            Mail,
            mobile,
            linkedin,
            address,
            university,
            year,
            branch,
            domain,
            introduction
        };

        // Check string-based required fields
        for (const [key, value] of Object.entries(requiredFields)) {
            if (!value || typeof value !== 'string' || value.trim() === '') {
                missingFields.push(key);
            }
        }

        // Boolean-type required fields
        if (typeof unpaidWillingness === 'undefined') missingFields.push('unpaidWillingness');
        if (typeof followLinkedin === 'undefined') missingFields.push('followLinkedin');
        if (typeof followInstagram === 'undefined') missingFields.push('followInstagram');
        if (typeof terms === 'undefined') missingFields.push('terms');

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields.',
                missingFields
            });
        }

        const certificates = req.files?.certificates?.[0]?.path || null;
        const resume = req.files?.resume?.[0]?.path || null;

        const newApplication = new InternshipApplication({
            Name,
            Mail,
            mobile,
            linkedin,
            address,
            university,
            year,
            branch,
            domain,
            introduction,
            github,
            additionalData,
            unpaidWillingness: unpaidWillingness === 'true' || unpaidWillingness === true,
            followLinkedin: followLinkedin === 'true' || followLinkedin === true,
            followInstagram: followInstagram === 'true' || followInstagram === true,
            agreedToTerms: terms === 'true' || terms === true || terms === 'on',
            certificates,
            resume
        });

        await newApplication.save();
        console.log('Saving application:', newApplication);


        return res.status(201).json({
            success: true,
            message: 'Application submitted successfully'
        });

    } catch (error) {
        console.error('Application error:', {
            message: error.message,
            stack: error.stack
        });

        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: validationErrors
            });
        }

        // Generic server error
        return res.status(500).json({
            success: false,
            error: 'Server error. Please try again later.',
            ...(process.env.NODE_ENV === 'development' && { detail: error.message })
        });
    }
};

module.exports = { submitApplication };
