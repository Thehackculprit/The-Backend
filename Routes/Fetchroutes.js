// Routes/tweetRoutes.js

const express = require("express");
const router1 = express.Router();
const { FetchTweets } = require("../controllers/tweet"); //

router1.get("/fetch", FetchTweets);

module.exports = router1;
