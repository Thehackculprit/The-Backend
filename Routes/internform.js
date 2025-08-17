const express = require('express');
const router = express.Router();
const { submitApplication } = require('../controllers/InternFullApplication');
const upload = require('../middleware/multer'); // your multer setup

router.post('/apply', upload.fields([
    { name: 'certificates', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
]), submitApplication);

module.exports = router;
