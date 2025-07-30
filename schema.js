const Joi = require('joi')

// Listing Schema validation from server side using -- Joi
module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required() , 
        description : Joi.string().required() , 
        location : Joi.string().required() , 
        country : Joi.string().required() , 
        price : Joi.number().required().min(0) , 
        image: Joi.object({
            url: Joi.string().uri().allow("", null),
            filename: Joi.string().allow("", null)
        }).allow(null)
    //  image : Joi.string().allow("" , null) ,  
    }).required() , 
})

//Review Schema validation from server side using -- Joi
module.exports.reviewSchema  = Joi.object({
    review : Joi.object({
        rating : Joi.number().required().min(1).max(5) , 
        comment : Joi.string().required()
    }).required() , 
})