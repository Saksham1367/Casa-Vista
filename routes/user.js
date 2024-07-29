const express =require("express");
const router = express.Router({mergeParams:true});
const WarpAsync =require("../ultis/warpasync.js");
const passport =require("passport");
const {originalUrl} = require("../ultis/isLoggedIn.js");
const { signup, login, logout } = require("../controllers/user.js");

router.route("/signup")
// signup get route
.get(async(req,res)=>{
    res.render("users/signup.ejs");
})
// signup post route
.post(WarpAsync(signup))


router.route("/login")
// login get route
.get(async(req,res)=>{
    res.render("users/login.ejs");
})
// login post route
.post(
    originalUrl,
    passport.authenticate('local', { failureRedirect: '/login',failureFlash:true }),
    WarpAsync(login));


// logout route
router.get("/logout",logout)

module.exports =router;