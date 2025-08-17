const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String },
    createdAt: { type: Date, default: Date.now },
    Tweets: { type: String },
    verified: { type: Boolean, default: false } // 🔁 changed from "Status" string
});

const Blog = mongoose.models.Blog || mongoose.model('Blog', postSchema);
module.exports = Blog;
