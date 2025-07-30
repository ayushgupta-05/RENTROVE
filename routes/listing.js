const express = require("express") ; 
const router = express.Router() ; 
//Requiring Listing --> Schema 
const Listing = require("../models/listing.js") ;
//Requiring the wrapAsync function for error handling (server side)
const wrapAsync = require("../utils/wrapAsync")
// //Listing/Review schema valid Server side --> Joi
// const {listingSchema }  = require("../schema.js")
// //Exporing Custom ExpressError class
// const ExpressError = require("../utils/ExpressError")
//Require isLoggedIn middleware to check if the user is login or not
const {isLoggedIn , isOwner , validateListing} = require("../middleware.js") ; 


//Requiring Multer for Multiform datatype
const multer = require("multer") ; 
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage }) 

//Requiring Listing Controller 
const listingController = require("../controllers/listings");

router.route("/")
.get( wrapAsync(listingController.index)) 
.post( upload.single('image') ,isLoggedIn , validateListing  , wrapAsync(listingController.createRouteForm)  ) ; 
// .post( upload.single('image') ,(req, res)=>{
// res.send(req.file) ; 
// }  ) ; 




//All Listing Route -- Index Route (used as router.route) ; 
// router.get("/"  , wrapAsync(listingController.index)) ; 
   
   //Create Route
// router.post("/" , isLoggedIn , validateListing  , wrapAsync(listingController.createRouteForm)  ) ; 
   

   //New route
router.get("/new" ,isLoggedIn , listingController.renderNewForm) ; 

   
   //Show route 
router.get("/:id", wrapAsync(listingController.showRouteForm));

   //Edit route
router.get("/:id/edit" , isLoggedIn , isOwner ,  wrapAsync(listingController.editRouteForm ))

   //Update route
   router.put("/:id", 
  isLoggedIn, 
  isOwner, 
  upload.single('image'), //Handle single file upload (updated name)
  validateListing, 
  wrapAsync(listingController.updateRouteForm)
);
// router.put("/:id" , isLoggedIn , isOwner , validateListing , wrapAsync(listingController.updateRouteForm));

//Delete Route
router.delete("/:id", isLoggedIn, isOwner ,  wrapAsync(listingController.deleteRoute));   

module.exports = router ; 