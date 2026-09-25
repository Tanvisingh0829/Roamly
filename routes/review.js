const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync.js');
const Review = require("../models/review.js");
const Listing = require("../models/listing.js")
const {validateReview,isLoggedIn,isAuthor} = require('../middlewares.js');
const reviewController = require('../controllers/reviews.js');
const review = require('../models/review.js');

// Reviews Route
// Post Review Route
router.post("/",isLoggedIn,validateReview,reviewController.postReview);

// Delete Review Route
router.delete("/:reviewId",isLoggedIn,isAuthor,reviewController.deleteReview);

module.exports = router;