const mongoose = require("mongoose");
const WorkPostSchema = new mongoose.Schema({
    title:{
        type:String,
        require:true,
        unique:true,
    },
    desc:{
        type:String,
        require:true,
    },
    isActive:{
        type:Boolean,
        default:true,
    },
    photo:{
        type:String,
        require: true,
    }
},{timestamps:true});
module.exports = mongoose.model("Workpost", WorkPostSchema);