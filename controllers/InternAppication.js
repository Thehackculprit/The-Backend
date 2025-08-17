const Intern = require("../model/Intern");

const InternApplicationController = async (req, res) => {
    try {
        const { Name, Mail, Phone, College } = req.body;

        if (!Name || !Mail || !Phone || !College) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newIntern = new Intern({ Name, Mail, Phone, College });
        await newIntern.save();

        return res.status(201).json({
            success: true,
            message: "Intern application submitted successfully",
            data: newIntern,
        });

    } catch (error) {
        console.error("Error saving intern:", error);
        return res.status(500).json({ error: "Server error" });
    }
};

module.exports = { InternApplicationController };
