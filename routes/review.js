const express =require("express");
const router = express.Router({mergeParams:true});
const WarpAsync =require("../ultis/warpasync.js");
const { isLoggedIn } = require("../ultis/isLoggedIn.js");
const { reviewIndex, reviewDestroy } = require("../controllers/reviews.js");


// review route
router.post("/",isLoggedIn,WarpAsync(reviewIndex));

// delete review route
router.delete("/:rid",isLoggedIn,WarpAsync(reviewDestroy))

module.exports =router;