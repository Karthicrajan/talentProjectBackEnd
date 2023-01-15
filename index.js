const express = require("express");
const app = express();
const mongoose = require("mongoose");
const workpost = require("./routes/workpost");
const auth = require("./routes/auth");
const manageUser = require("./routes/manageUser");
const path = require("path"); 
const cors = require('cors');
app.use(cors({
    origin:"https://lively-sprite-f6dc40.netlify.app",
}))
app.use("/images", express.static(path.join(__dirname,"/images")));
require("dotenv").config();
console.log('this is tes');
app.use(express.json());
mongoose.connect(process.env.MONGO_URL).then(
    console.log("database connected")
).catch((err)=>{
    console.log(err);
})

app.use("/api/workposts", workpost);
app.use("/api/auth",auth);
app.use("/api/manageUser", manageUser);
app.listen(process.env.PORT || 5000, function(){
    console.log("server is runinh 5000");
});
