const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    userName:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
    },
    isActive:{
        type:Boolean,
        default:true
    }
});
module.exports = mongoose.model("User", UserSchema);