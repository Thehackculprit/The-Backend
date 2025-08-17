const express = require("express");
const router = express.Router();
const { generateAllApplicationsExcel } = require("../controllers/wordController");

router.get("/generate-word/all", generateAllApplicationsExcel);

module.exports = router;
