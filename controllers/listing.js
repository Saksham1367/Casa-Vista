const Listing = require("../models/listing.js");
const listingSchema =require("../serverschema/listingSchema.js");
const ExpressError =require("../ultis/expresserror.js");
// for geocoding
const mbxGeoCoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeoCoding({ accessToken: mapToken });

// index route
module.exports.index=(req,res,next)=>{
    try{
    Listing.find({})
    .then((data)=>{
        res.render("listings/index.ejs",{data});
    }).catch((err)=>{
        console.log(err);
    })}catch(err){
        next(err);
    }
};

//create route
module.exports.create=async (req,res)=>{
    // for geocoding
    let coordinates= await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit: 1
      })
     .send();        
    let data = req.body;
    let {path,filename} =req.file;
    // let {error} = listingSchema.validate(data);
    // if(error){
    //     throw new ExpressError(400,error);
    // }
    let newListing = new Listing({...data})
    newListing.owner =req.user._id;
    newListing.image={path,filename};
    newListing.geometry =coordinates.body.features[0].geometry;
    await newListing.save();
    req.flash("success","Your Listing Has Been Created On CasaVista!!");
    res.redirect("/listings");
}

// show route

module.exports.show=(req,res,next)=>{
    let {id}=req.params;
    try{
    Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner")
    .then((data)=>{
        if(!data){
            req.flash("error","Listing That You Are Trying To Access Doesn't Exist");
            res.redirect("/listings");
        }
        res.render("listings/show.ejs",{data});
    }).catch((err)=>{
        console.log(err);
    })}catch(err){
        next(err);
    }
}

// edit route
module.exports.edit=(req,res,next)=>{
    try{
    let {id}=req.params;
    Listing.findById(id)
    .then((data)=>{
        if(!data){
            req.flash("error","Listing That You Are Trying To Access Doesn't Exist");
            res.redirect("/listings");
        }
        res.render("listings/edit.ejs",{data});
    }).catch((err)=>{
        console.log(err);
    })}catch(err){
        next(err);
    }
    
}
//update route
module.exports.update =async(req,res,next)=>{
    try{
    let {id}=req.params;
    let data=req.body;
    let {error} = listingSchema.validate(data);
    if(error){
        throw new ExpressError(400,error);
    }
    Listing.findByIdAndUpdate(id,{...req.body})
    .then((data)=>{
        if(typeof req.file !=="undefined"){
        let {path,filename} =req.file;
        data.image={path,filename};
        data.save();
        }
        req.flash("success","Your Listing Has Been Updated!!");
       res.redirect(`/listings/${id}`);
    }).catch((err)=>{
        console.log(err);
    })}catch(err){
        next(err);
    }
    
}

// delete route
module.exports.destroy =(req,res,next)=>{
    try{
    let {id}=req.params;
    Listing.findByIdAndDelete(id)
    .then((data)=>{
        req.flash("success","Your Listing Has Been Deleted From CasaVista !!"); 
        res.redirect("/listings");
    }).catch((err)=>{
        console.log(err);
    })}catch(err){
        next(err);
    }
    
}

// search route
module.exports.searchbar =async(req,res)=>{
    let data = req.body;
    let listing =await Listing.findOne({title:data.search});
    if(listing){
        let id = listing._id;
        res.redirect(`/listings/${id}`);
    }
    req.flash("error","This Listings Doesn't Exist On CasaVista!!");
    res.redirect("/listings");
}

// filter route
module.exports.filter=async(req,res)=>{
    let data =req.params;
    let filter =data.filter;
    let listings =await Listing.find({filter :filter});
    res.render("listings/filter.ejs",{listings,filter});
}