const express = require("express") ; 
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const router = express.Router() ; 
const user = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const userController = require("../controllers/users")

router.get("/signup" , (req , res)=>{
    res.render("../views/users/signup.ejs") ; 
})

router.post("/signup" , wrapAsync(userController.signupPost)
) ; 

 
router.get("/login" , (req , res)=>{
    res.render("../views/users/login.ejs") ; 
})

//middleware to authenticate the user 
router.post("/login" , 
saveRedirectUrl, 
passport.authenticate('local' , {failureRedirect : '/login' , failureFlash : true }),
userController.login
)

//Logout route
router.get("/logout" , userController.logout)

module.exports = router ;   
