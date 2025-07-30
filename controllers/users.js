const user = require("../models/user") ; 

module.exports.signupPost = async(req , res)=>{
    try{
        let {username , email , password} = req.body ; 
       const newUser = new user({email , username}) ; 
       let resgisteredUser = await user.register(newUser, password) ; 
       console.log(resgisteredUser) ; 
       req.login(resgisteredUser , (err)=>{
        if(err){
            return next(err) ;
        } 
        req.flash("success" , "Welcome to RENTROVE")
        res.redirect("/listings") ; 
       })
      
    }catch(e){
        req.flash("error" , e.message ) ; 
        res.redirect("/signup") ; 
    }     
}

module.exports.login = async(req , res)=>{
    req.flash("success" , "Welcome back to RENTROVE , You are logged in ") 
    // res.redirect(req.locals.redirectUrl) ; 
    const redirectUrl = res.locals.redirectUrl || "/listings";  // fallback
        res.redirect(redirectUrl);
}

module.exports.logout  = (req, res , next)=>{
    req.logOut((err)=>{
        if(err){
           return next(err) ; 
        }
        req.flash("success", "You are logged out!")
            res.redirect("/listings") ; 
    })
}