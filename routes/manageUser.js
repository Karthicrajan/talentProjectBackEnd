const router = require("express").Router();
const { model } = require("mongoose");
const User = require("../model/User");

//to get all user
router.get('/getAllUser', async(req,res)=>{
    try{
        const allUser = await User.find();
        res.status(200).json(allUser);
    }catch(err){
        res.status(500).json(err);
    }
})
module.exports = router;