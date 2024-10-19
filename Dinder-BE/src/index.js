const express = require("express");
const connectDB = require("./config/Database");
const app = express();
const User = require("./models/user");//model

app.use(express.json());//built-in middleware function in Express - parses incoming req json data 

//saving data to database
app.post("/signup",async(req,res)=>{
    try{
    const user = new User(req.body);
    await user.save();
    res.send("user added");
    }
    catch(err){
        res.status(404).send("something went wrong" + err);
    }
});

//getting user by emailId
app.get("/user", async(req,res)=>{
    try{
        const users = await User.findOne({emailId: req.body.emailId}); //returns doc with smallest id among matched ones 
        // and if you do not pass any filter - then also doc with smallest id is returned among all or any random doc
        res.send(users);
    }
    catch(err){
        res.status(404).send("something went wrong"+ err);
    }
});

//getting all the users for the feed
app.get("/feed", async(req,res)=>{
    try{
        const users = await User.find({});
        res.send(users);
    }
    catch(err){
        res.status(404).send("something went wrong"+ err);
    }
});

//deleting data from database
app.delete("/user",async(req,res)=>{
    try{
        await User.deleteMany({firstName:req.body.firstName});
        res.send("users deleted successfully");
    }
    catch(err){
        res.status(404).send("something went wrong"+ err);
    }
});

//update datatbase docs
app.patch("/user", async(req,res)=>{
    try{
        await User.findByIdAndUpdate(req.body.userId,req.body, {runValidators:true});//if any feilds does not match model- those feilds are not added or updated to db
        res.send("updated successfully");
    }
    catch(err){
        res.status(404).send("something went wrong"+ err);
    }
});

connectDB().then(()=>{
console.log("db connected");
app.listen(3000,()=>{
    console.log("server running at port 3000");  
});
}).catch((err)=>{
console.error(err);
})
