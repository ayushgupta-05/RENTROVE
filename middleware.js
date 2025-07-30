module.exports.isLoggedIn = (req , res , next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl  ; 
        req.flash("error" , "You must need to login to create a listing")
        return  res.redirect("/login") ;
    }
    next() ; 
}

module.exports.saveRedirectUrl = (req , res, next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl =  req.session.redirectUrl ;
    }
    next() ; 
}

const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

module.exports.isOwner = async(req ,res, next) =>{
    let { id } = req.params;
    let listing  = await Listing.findById(id) ; 
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error" , "Sorry! You don't have access")
       return res.redirect(`/listings/${id}`);    
    }
    next() ; 
}

//Listing/Review schema valid Server side --> Joi
const {listingSchema ,reviewSchema }  = require("./schema.js")
//Exporing Custom ExpressError class
const ExpressError = require("./utils/ExpressError.js")

//Validate Listing Function - Joi (middleware)
module.exports.validateListing = (req ,res , next) =>{
    let {error} = listingSchema.validate(req.body) ; 
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400, errMsg) ; 
    }else{
        next() ; 
    }
}


//Validate Review Function - Joi(middleware)
module.exports.validateReview = (req ,res , next) =>{
    let {error} = reviewSchema.validate(req.body) ; 
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400, errMsg) ; 
    }else{
        next() ; 
    }
}

module.exports.isReviewAuthor = async(req ,res, next) =>{
    let { id ,  reviewId } = req.params;
    let review  = await Review.findById(reviewId) ; 
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error" , "Sorry! You don't have access")
       return res.redirect(`/listings/${id}`);    
    }
    next() ; 
}