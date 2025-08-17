const express = require("express");
const router = express.Router();

const {InternApplicationController} = require("../controllers/InternAppication");
router.post("/fillup", InternApplicationController );

module.exports = router;