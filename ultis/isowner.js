const Listing = require("../models/listing.js");
let isOwner = async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","Your Are Not The Owner Of This Listing!!")
        res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports =isOwner;