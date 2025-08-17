const express = require("express");
const router = express.Router();
const Blog = require("../model/Blog");
const nodemailer = require("nodemailer");

// Hardcoded acceptor email (you can also use process.env)
const ACCEPTOR_EMAIL = "acceptor@example.com";

router.post("/create", async (req, res) => {
    try {
        const { title, content, author } = req.body;

        const blog = new Blog({ title, content, author, status: "unverified" });
        await blog.save();

        // Send mail
        const transporter = nodemailer.createTransport({
            service: "gmail", // or use Mailtrap for testing
            auth: {
                user: "your-email@gmail.com",
                pass: "your-app-password"
            }
        });

        const approvalLink = `http://localhost:3000/api/blog/verify/${blog._id}`;

        await transporter.sendMail({
            from: `"BlogBot" <your-email@gmail.com>`,
            to: ACCEPTOR_EMAIL,
            subject: "New Blog Pending Approval",
            html: `
                <h2>📝 New Blog Submitted</h2>
                <p><strong>Title:</strong> ${title}</p>
                <p><strong>Author:</strong> ${author}</p>
                <p><strong>Status:</strong> ${blog.status}</p>
                <p><strong>Excerpt:</strong> ${content.slice(0, 300)}...</p>
                <a href="${approvalLink}" style="padding: 10px 15px; background: green; color: white; text-decoration: none; border-radius: 5px;">✅ Approve Blog</a>
            `
        });

        res.status(201).json({ success: true, message: "Blog created and approval mail sent." });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to submit blog." });
    }
});
