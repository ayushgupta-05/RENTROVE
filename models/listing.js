const mongoose = require("mongoose") ; 
const Schema = mongoose.Schema ; 
const Review = require("./review.js")
const User = require("./user.js") ; 

const listingSchema  = new Schema({
    title : {
        type : String , 
        required : true
    } , 
    description : String , 
    image : {
        filename: String,
        url: {
            type : String ,
            default : "https://www.propertypanda.com/front/images/properties-default-image.png" ,
            set : (v)=> v===""? "https://www.propertypanda.com/front/images/properties-default-image.png" : v
        }
    } , 
    // image: {
    //     type: String,
    //     default: "https://www.propertypanda.com/front/images/properties-default-image.png",
    //     set: (v) => v === "" ? "https://www.propertypanda.com/front/images/properties-default-image.png" : v
    //   },      
    price : Number , 
    location : String , 
    country : String , 
    reviews : [
        {
            type: Schema.Types.ObjectId , 
            ref : "Review"
        }
    ] ,
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    } , 
    category: {
        type: String,
        enum: ['Trending', 'Rooms', 'Iconics', 'Mountains', 'Villa', 'Pool', 'Camping', 'Farms', 'Artic'],
        required: true
      },

}) ;

//Mongoose Middleware - if post is deleted corresponding all reviews are deleted
listingSchema.post("findOneAndDelete" , async(Listing)=>{
    if(Listing){
        await Review.deleteMany({ _id : {$in : listing.reviews}})
    }
})

const Listing = mongoose.model("Listing" , listingSchema) ;

module.exports = Listing ; 