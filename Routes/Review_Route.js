const express = require("express");
const router = express.Router();
const upload = require('../middleware/multer');


const {fetchTestimonials, fetchReviews} = require("../controllers/TestimonailController");
const {createTestimonial} = require("../controllers/review");
router.post("/createTestimonial", fetchTestimonials );
router.get("/fetchReviews", fetchReviews);
router.post('/post-review', upload.single('photo'), createTestimonial);

module.exports = router;