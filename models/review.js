const mongoose = require("mongoose");

const reviewSchema=mongoose.Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    date:{
        type:Date,
        default:Date.now()
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

})

module.exports = mongoose.model("Review",reviewSchema);
