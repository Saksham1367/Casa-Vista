if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
const express =require("express");
const app = express();
const path = require("path");
const method = require("method-override");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const ExpressError =require("./ultis/expresserror.js");
const listingRoute =require("./routes/listing.js");
const reviewRoute =require("./routes/review.js");
const userRoute =require("./routes/user.js");
const session =require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const User =require("./models/user.js");
const passport =require("passport");
const LocalStrategy = require("passport-local");


app.set("view engine","ejs");
app.engine("ejs", ejsMate);
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(method("_method"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const dbUrl=process.env.ATLASDB_URL;
// mongo store for sessions
const mStore =MongoStore.create({ 
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SESSION_SECRET
    },
    touchAfter:24*3600
});
mStore.on("error",(err)=>{
    console.log("Error Occured In Mstore",err);
});

// sessions middleware
app.use(session({
    store:mStore,
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
}}));
// middleware for flash 
app.use(flash());

async function main() {
    await mongoose.connect(dbUrl);
}

main()
.then((result)=>{
    console.log("Connected With MongoDB Server");
}).catch((err)=>{
    console.log(err);
})

app.listen(3000,()=>{
    console.log("server is listening to port no: 3000");
});

// setting up passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//middleware for flash 
app.use((req,res,next)=>{
    res.locals.success =req.flash("success");
    res.locals.error =req.flash("error");
    res.locals.currUser =req.user;
    next();
}) 

// router for listings routes
app.use("/listings",listingRoute);

// router for review routes
app.use("/listings/:id/reviews",reviewRoute);

// router for user routes
app.use("/",userRoute);

// error handling for "page not found"
app.all("*",(req,res,next)=>{
    next( new ExpressError(404,"Page Not found!!"));
})

// Custom error handling middleware
app.use((err,req,res,next)=>{
    let {status=500,message="something went wrong !!"} =err;
    res.render("listings/error.ejs",{message});
})



