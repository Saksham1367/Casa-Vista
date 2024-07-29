const express =require("express");
const router = express.Router();
const WarpAsync =require("../ultis/warpasync.js");
const {isLoggedIn} =require("../ultis/isLoggedIn.js");
const isOwner = require("../ultis/isowner.js");
const { index,create ,show,edit, update,destroy, searchbar, filter} = require("../controllers/listing.js");
const multer  = require("multer");
const { storage } = require("../ultis/cloudinary.js");
const upload = multer({storage});


// filter route
router.get("/:filter/Cv",WarpAsync(filter))

// search route
router.post("/search",WarpAsync(searchbar))

// new route
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs");
})

router.route("/")
// create route
.post(isLoggedIn,upload.single("image"), WarpAsync(create))
// Index route
.get(index)


// edit route
router.get("/:id/edit",isLoggedIn,isOwner,edit);


router.route("/:id")
// show route
.get(isLoggedIn,show)
// update route
.put(isLoggedIn,isOwner,upload.single("image"),update)
// delete route
.delete(isLoggedIn,isOwner,destroy);




module.exports =router;