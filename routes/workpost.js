const router = require("express").Router();
const Workpost = require("../model/Workpost");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const { appendFile } = require("fs");

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, "images");
    },
    filename:(req,file,cb)=>{
        console.log(req.body.name);
        cb(null, req.body.name);
    }
})
const upload = multer({storage:storage});
router.post("/uploadPostImg",upload.single("file"),(req,res)=>{
    res.status(200).json("file had been uploaded");
})
const verify = (req,res,next) =>{
    const authHeader = req.body.headers.authorization;
    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token,"mySecretkey",(err,user)=>{
            if(err){
                return res.status(401).json("Token is not valid!");
            }
            req.user = user;
            next();
        })
    }else{
        res.status(200).json("Your are not authenticated!");
    }
}
//create work post
router.post('/createpost', verify, async (req,res)=>{
    const newWorkPost = new Workpost(req.body);
    try{        
        const savedPost = await newWorkPost.save();  
        res.status(200).json(savedPost);
    }catch(err){
        res.status(500).json(err);
    }
});

// JWT inActivepost 
router.put('/inActive', verify, async (req,res)=>{
    try{
        const newWorkPostSataus = await Workpost.findByIdAndUpdate(req.body.id,{
            $set : {isActive : req.body.isActive}
        },{new:true});
        // console.log(newWorkPostSataus);
        res.status(200).json(newWorkPostSataus);
    }catch(err){
        res.status(500).json(err);
    }
})



// router.put('/inActivePost', async (req,res)=>{
//     try{
//         const newWorkPostSataus = await Workpost.findByIdAndUpdate(req.body.id,{
//             $set : {isActive : req.body.isActive}
//         },{new:true});
//         res.status(200).json(newWorkPostSataus);
//     }catch(err){
//         res.status(500).json(err);
//     }
// })
router.get('/workpostsAll', async (req,res)=>{
    try{
        const allPost = await Workpost.find();
        res.status(200).json(allPost);
    }catch(err){
        res.status(500).json(err);
    }
})
router.get('/getactivepost', async(req,res)=>{
    try{
        const allActivePost = await Workpost.find({isActive:true});
        res.status(200).json(allActivePost);
    }catch(err){
        console.log(err);
    }
})
router.delete('/:id', async(req,res)=>{
    try{
       const delres = await Workpost.findByIdAndDelete(req.params.id);
        res.status(200).json("post Deleted");
    }catch(err){
        console.log(err);
    }
})
router.get('/:id',async(req,res)=>{
    try{
        const singlePost = await Workpost.findById(req.params.id);
        res.status(200).json(singlePost);
        // console.log(singlePost);
    }catch(err){
        console.log(err);
    }
})
router.put('/editPost', verify, async(req,res)=>{
    try{
        const updatedPost = await Workpost.findByIdAndUpdate(req.body.id,{
            $set: {title: req.body.title}
        },{new: true});
        res.status(200).json(updatedPost);
    }catch(err){
        console.log(err);
    }
})
module.exports = router;