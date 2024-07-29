const reviewSchema =require("../serverschema/reviewSchema.js");
const Review =require("../models/review.js");
const ExpressError =require("../ultis/expresserror.js");
const Listing = require("../models/listing.js");

// review index route
module.exports.reviewIndex =async(req,res)=>{
    let {id}=req.params;
    let data =req.body;
    let {error} = reviewSchema.validate(data);
    if(error){
        throw new ExpressError(400,error);
    }
    let newReview = new Review(data);
    newReview.author =req.user._id;
    let listing = await Listing.findById(id);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Review Uploaded!!"); 
    res.redirect(`/listings/${id}`);
}

// review delete route
module.exports.reviewDestroy =async(req,res)=>{
    let {id,rid}=req.params;
    let review = await Review.findById(rid);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","Your Are not The Author Of this reviews")
        return res.redirect(`/listings/${id}`);
    }
     await Listing.findByIdAndUpdate(id ,{$pull:{reviews:rid}});
     await Review.findByIdAndDelete(rid);
     req.flash("success","Review Deleted!!"); 
     res.redirect(`/listings/${id}`);
}