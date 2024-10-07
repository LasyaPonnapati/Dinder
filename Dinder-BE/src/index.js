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
});

//getting user by emailId
app.get("/user", async(req,res)=>{
    try{
        const users = await User.findOne({}); //returns doc with smallest id among matched ones 
        // and if you do not pass any filter - then also doc with smallest id is returned among all or any random doc
        res.send(users);
    }
    catch(err){
        res.status(404).send("something went wrong");
    }
});

//getting all the users for the feed
app.get("/feed", async(req,res)=>{
    try{
        const users = await User.find({});
        res.send(users);
    }
    catch(err){
        res.status(404).send("something went wrong");
    }
})

connectDB().then(()=>{
console.log("db connected");
app.listen(3000,()=>{
    console.log("server running at port 3000");  
});
}).catch((err)=>{
console.error(err);
})
