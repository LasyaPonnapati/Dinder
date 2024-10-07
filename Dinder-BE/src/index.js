const express = require("express");
const connectDB = require("./config/Database");
const app = express();
const User = require("./models/user");

app.use(express.json());//built-in middleware function in Express - parses incoming req json data 

app.post("/signup",async(req,res)=>{
    const user = new User(req.body);
    await user.save();
    console.log("data inserted into user collection");
    res.send("user added");
})

connectDB().then(()=>{
console.log("db connected");
app.listen(3000,()=>{
    console.log("server running at port 3000");  
});
}).catch((err)=>{
console.error(err);
})
