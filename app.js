if(process.env.NODE_ENV != "production"){
    require('dotenv').config()    
}

//Require express
const express = require("express") ; 
const app = express() ; 
//Require Mongoose
const mongoose  = require("mongoose") ; 
//Requiring Listing --> Schema 
// const Listing = require("./models/listing.js") ;

//EJS
const path = require("path") ; 
app.set("view engine" , "ejs") ; 
app.set("views" , path.join(__dirname , "views")) ; 
//POST Url encoded
app.use(express.urlencoded({extended: true })) ;
const methodOverride = require("method-override") ; 
app.use(methodOverride("_method")) ; 
//--------EJSMATE
const ejsMate = require("ejs-mate") ; 
// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);
//Public folder 
app.use(express.static(path.join(__dirname , "/public")))
//Requiring the wrapAsync function for error handling (server side)
// const wrapAsync = require("./utils/wrapAsync")


//Exporing Custom ExpressError class
const ExpressError = require("./utils/ExpressError")
//Listing/Review schema valid Server side --> Joi
// const {listingSchema , reviewSchema}  = require("./schema.js")

//Requiring Review --> Schema 
// const Review = require("./models/review.js") ;

//--------Requiring Listings Routes-----------------
const listingRouter = require("./routes/listing.js")

//--------Requiring Reviews Routes-----------------
const reviewRouter = require("./routes/review.js")

//--------Requiring Reviews Routes-----------------
const userRouter = require("./routes/user.js")

//Requiring the Express-Session
const session = require("express-session") ; 
const MongoStore = require('connect-mongo'); 

//Requiring connect-flash 
const flash = require("connect-flash") ; 


//-------------------------Authentication---------------------------
const passport = require("passport") ; 
const LocalStrategy = require("passport-local") ; 
const User = require("./models/user.js")

let url = 'mongodb://127.0.0.1:27017/rentrove' ; 

//Atlas DB URL 
const dbUrl = process.env.ATLASDB_URL ; 
//Connecting mongoose
async function main(){
    // await mongoose.connect(url);
    await mongoose.connect(dbUrl);
}

main().then((res)=>{
    console.log("Connection Build")
})
.catch((err)=>{
    console.log(err) ;
})

app.listen(8080 , ()=>{
    console.log(`App is listening`)
})

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SECRET , 
    } , 
    touchAfter : 24 * 3600  , 
})

store.on("error" , ()=>{
    console.log("Error in Mongo Session Store " , err ) ; 
})
const sessionOptions = {
    store ,  
    secret  : process.env.SECRET , 
    resave : false , 
    saveUninitialized : true , 
    cookie :{
        expires : Date.now() + 7* 24 * 60 *  60 * 1000 ,
        maxAge: 7* 24 * 60 *  60 * 1000 ,
        httpOnly  :true , 
    }
}



//-------------------------Working Route----------------------------
// app.get("/" , (req, res)=>{
//     res.send("Home Page of the Site") ; 
// })

//Session middleware
app.use(session(sessionOptions)) ; 
app.use(flash())

//Passport used after session middlewares
app.use(passport.initialize()) ; 
app.use(passport.session()) ; 
passport.use( new LocalStrategy(User.authenticate()))  ; 

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req , res, next)=>{
    res.locals.success = req.flash("success") ; 
    res.locals.error = req.flash("error") ; 
    res.locals.currUser = req.user ; 
    next() ; 
})

//Demo user Route for authentication
// app.get("/demouser" , async(req , res)=>{
//     let fakeUser = new User({
//         email : "login2ayushgupta@gmail.com" , 
//         username : "ayushgupta05"
//     }) ;

// //pbkdf2 hashing algo is used     
//     let registeredUser = await User.register(fakeUser , "12345678");
//     res.send(registeredUser) ; 
// })




//Express Routes common paths 
app.use("/listings" , listingRouter) ; 
app.use("/listings/:id/reviews" , reviewRouter) ; 
app.use("/" , userRouter) ;

 
//For all Unknown paths 
app.all("/*path" , (req , res , next)=>{ 
    next(new ExpressError(404 , "Page not Found"))
})


//Error handle Middleware
app.use((err , req, res , next)=>{
    const { statusCode = 500, message = "Something went wrong" } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs" , {err})
});


// app.get("/testListing" , async(req, res)=>{
//     let sampleListing  = new Listing({
//         title : "My villa" , 
//         description : "By the heart of town" , 
//         price : 1200 , 
//         location : "Moradabad" , 
//         country : "India" 
//     })

//     await sampleListing.save() ; 
//     console.log("Sample saved") ; 
//     res.send("Successful testing") ; 
// })

