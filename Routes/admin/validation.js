const express = require("express");
const { ValidationHandler } = require("../../controllers/ValidationHandler");

const router = express.Router();

router.post("/validation", ValidationHandler);

module.exports = router;
