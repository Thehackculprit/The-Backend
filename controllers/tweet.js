const User = require("../model/User");
const Blog = require("../model/Blog");
const nodemailer = require("nodemailer");
const { ACCEPTOR_EMAIL } = process.env;
require('dotenv').config();



const createTweet = async (req, res) => {
    try {
        const { title, content, author, verified } = req.body; // ✅ include `verified`

        console.log("Received data:", { title, content, author, verified });

        if (!title || !content || !author) {
            console.warn("Missing fields:", { title, content, author });
            return res.status(400).json({
                message: "All fields (title, content, author) are required",
                success: false,
            });
        }

        const newTweet = await Blog.create({
            title,
            content,
            author,
            verified: typeof verified === "boolean" ? verified : false, // ✅ boolean fallback
        });

        console.log("✅ Tweet created:", newTweet);

        return res.status(201).json({
            message: "Tweet created successfully",
            success: true,
            data: newTweet,
        });

    } catch (err) {
        console.error("❌ Error details:");
        console.error("Name:", err.name);
        console.error("Message:", err.message);
        console.error("Stack:", err.stack);

        res.status(500).json({
            message: "Internal server error while creating tweet.",
            success: false,
            error: err.message
        });
    }
};


const FetchTweets = async (req, res) => {
    console.log("FetchTweets controller hit");
    try {
        // The change is here: We added { verified: true } to the find() method.
        // This tells the database to only return documents where the 'verified' field is true.
        const tweets = await Blog.find({ verified: true }).sort({ createdAt: -1 });

        res.status(200).json({
            message: "Verified tweets fetched successfully",
            success: true,
            data: tweets
        });
    } catch (e) {
        console.log("Can't be fetched", e);
        res.status(400).json({
            message: "Tweets cannot be fetched",
            success: false
        });
    }
};
module.exports = {
    createTweet,
    FetchTweets,
};
