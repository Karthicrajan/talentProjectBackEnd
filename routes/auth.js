const router = require("express").Router();
const { model } = require("mongoose");
const Workpost = require("../model/Workpost");
const User = require("../model/User");
const jwt = require("jsonwebtoken");

let refreshTokens = []; 

router.post('/register', async (req,res)=>{
    const newUser = new User(req.body);
    try{
        const userResult = await newUser.save();
        res.status(200).json(userResult);
    }catch(err){
        res.status(500).json(err);
    }
});
const verify = (req,res,next) =>{
    console.log(req.headers.authorization);
    const authHeader = req.body.headers.authorization;
    console.log(authHeader);
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
router.put('/inActive', verify, async (req,res)=>{
    try{
        const newWorkPostSataus = await Workpost.findByIdAndUpdate(req.body.id,{
            $set : {isActive : req.body.isActive}
        },{new:true});
        res.status(200).json(newWorkPostSataus);
    }catch(err){
        res.status(500).json(err);
    }
})
const generateAccessToken = (user) =>{
    return jwt.sign({id : user.id,isActive: user.isActive},"mySecretkey",{expiresIn : "30m"});
} 
const generateRefresh = (user)=>{
    return jwt.sign({id : user.id,isActive: user.isActive},"myRefreshSecretkey");
}
//refreah token api
router.post('/refresh', (req,res)=>{
    const refreshToken = req.body.token;
    if(!refreshToken) return res.status(401).json("Your are not authenticated");
    if(!refreshTokens.includes(refreshToken)){
        return res.status(403).json("Refresh token is not valid");
    }
    jwt.verify(refreshToken,"myRefreshSecretkey",(err,user)=>{
        err && console.log(err);
        refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
        const newAccessToken = generateAccessToken(user);
        const newRefresh = generateRefresh(user);
        res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefresh,
        })
    })
});



router.post('/login', async(req,res)=>{
    try{
        const loginResult = await User.findOne({"userName" : req.body.userName,"password" : req.body.password});
        if(loginResult == ''){
   
            res.status(404).json("User name or pasword not matched");
        }else{
            //generate access token
            const accessToken = generateAccessToken(loginResult);
            const refreshToken = generateRefresh(loginResult);
            refreshTokens.push(refreshToken);
            res.status(200).json({
                userName : loginResult.userName,
                isActive: loginResult.isActive,
                accessToken,
                refreshToken,
            });
            // res.status(200).json(loginResult)
        }
        
    }catch(err){
        res.status(500).json(err);
    }
})

router.post('/logOut', verify,(req,res)=>{
    const refreshToken = req.body.token;
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    res.status(200).json("You logged out successfully");
})
router.post('/checkToken',verify,(req,res)=>{
    try{
    // res.status(200).json(ress);
    }catch(err){
        res.status(500).json(err);
    }
    
})

module.exports = router;