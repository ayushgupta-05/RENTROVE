const Listing = require("../models/listing.js") ; 

module.exports.index = async (req , res )=>{
    const allListings =  await Listing.find({})  ; 
    res.render("./listings/index.ejs" , {allListings}) ; 
   }




module.exports.renderNewForm =  (req , res)=>{
    res.render("./listings/new.ejs" ) ; 
}
module.exports.createRouteForm = async (req, res) => {
    const newListing = new Listing(req.body.listing);

    if (req.file) {
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    newListing.owner = req.user._id; //This line is important

    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect(`/listings/${newListing._id}`);
};


// module.exports.createRouteForm = async(req , res, next)=>{ 

//     const newListing = new Listing(req.body.listing) ; 
//     newListing.owner = req.user._id ; 
//     await newListing.save() ; 
// //Using flash to show the flash message when listing is created
//  req.flash("success" , "New Listing Created! ")
//         res.redirect("/listings") ;

//    //We have used simpler option in key: value form
   
//        // let { title , description , image , price , location , country } = req.body 
//        // let newListing = new Listing({
//        //     title : title , 
//        //     description : description , 
//        //     price : price , 
//        //     location : location, 
//        //     country : country
//        // }) ; 
//        // let listing = req.body.listing ;    
//    //    if(!req.body.listing){
//    //     throw new ExpressError(400 , "Send valid data for listing")
//    //    }
//  }


module.exports.showRouteForm =   async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({path : "reviews" , populate : { path : "author"}  })
    .populate("owner");

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings"); 
    }

    res.render("listings/show.ejs", { listing });
}

module.exports.editRouteForm =  async (req , res)=>{
    let {id}  = req.params ; 
    const listing = await Listing.findById(id) ; 
    res.render("./listings/edit.ejs" , {listing}) ; 
}

module.exports.updateRouteForm = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findByIdAndUpdate(id, {
        ...req.body.listing
    });

    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await listing.save();

    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${listing._id}`);
};


// module.exports.updateRouteForm = async (req, res) => {
//     let { id } = req.params;

//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     req.flash("success", "Listing Updated")
//     res.redirect(`/listings/${id}`);
// }

module.exports.deleteRoute  = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    res.redirect(`/listings/`);
}