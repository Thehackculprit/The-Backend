// Routes/tweetRoutes.js

const express = require("express");
const router1 = express.Router();
const { lookupCertificate } = require("../controllers/LookupCertificate"); //

router1.get("/lookup", lookupCertificate);

module.exports = router1;
