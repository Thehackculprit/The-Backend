const express = require("express");
const { GetMailList } = require("../../controllers/MailerCollection");
const adminAuth = require("../admin/verification");

const router = express.Router();

router.get("/GetEmailList",adminAuth, GetMailList);

module.exports = router;
