const express = require("express") ; 
const router = express.Router({mergeParams : true}) ; 

const Review = require("../models/review.js") ;
const Listing = require("../models/listing.js") ;
//Requiring the wrapAsync function for error handling (server side)
const wrapAsync = require("../utils/wrapAsync")
// //Listing/Review schema valid Server side --> Joi
// const {reviewSchema}  = require("../schema.js")
//Exporing Custom ExpressError class
const ExpressError = require("../utils/ExpressError")
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js")


const reviewController = require("../controllers/reviews")

//--------------------REVIEWS------------------------------------------
//Review POST Route
router.post("/" , isLoggedIn , validateReview , wrapAsync(reviewController.reviewPostRoute))

//Review Delete Route
router.delete("/:reviewId", isReviewAuthor ,  isLoggedIn , wrapAsync(reviewController.deleteRoute));

module.exports = router ; 