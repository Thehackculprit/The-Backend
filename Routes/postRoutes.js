    const express = require("express");
    const router = express.Router();
    const { createTweet } = require("../controllers/tweet");
    router.post("/create", createTweet);
    module.exports = router;