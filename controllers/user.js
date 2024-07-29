const User =require("../models/user.js");


// sign up post route
module.exports.signup=async(req,res)=>{
    try{
    let {username ,email ,password}=req.body;
    let newUser = new User({
        email:email,
        username:username
    })
    let registeredUser =await User.register(newUser,password);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome To Casa Vista!!");
        res.redirect("/listings");
    })
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}

// login route
module.exports.login =async(req,res)=>{
    req.flash("success","Welcome Back to Casa Vista!!");
    let pathName= res.locals.path || "/listings";
    res.redirect(pathName);
}

// logout route
module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You Logged Out from CasaVista!!")
        res.redirect("/listings");
    })
}