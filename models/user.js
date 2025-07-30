const mongoose = require("mongoose") ; 
const {Schema} = mongoose  ; 
const passportLocalMongoose = require("passport-local-mongoose") ; 

const userSchema = new Schema({

    email : {
        type : String , 
        required : true ,
    } 
})

//passportLocalMongoose --> uses with plugin that will automatically create username & pwd wiht hashing and salting itself
userSchema.plugin(passportLocalMongoose) ; 

module.exports = mongoose.model("User" , userSchema); 