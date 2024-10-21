const express = require("express");
const User = require("../models/user");
const userAuth = require('../middlewares/Auth');

const profileRouter = express.Router();

//get user profile
profileRouter.get("/profile", userAuth, async(req,res)=>{
    try{
        const user = req.user
        res.send(user);
    }
    catch(err){
        res.status(404).send("something went wrong"+ err);
    }
});

//update user profile
profileRouter.patch("/user", userAuth, async(req,res)=>{
    try{
        //never trust req.body
        const ALLOWED_UPDATES = ["age", "gender", "description", "dpUrl"];
        const isUpdateAllowed = Object.keys(req.body).every((k)=>ALLOWED_UPDATES.includes(k));
        if(!isUpdateAllowed){
            throw new error("update not allowed for these feilds");
        }
        await User.findByIdAndUpdate(req.body.userId,req.body, {runValidators:true});//if any feilds does not match model- those feilds are not added or updated to db
        res.send("updated successfully");
    }
    catch(err){
        res.status(404).send("something went wrong"+ err);
    }
});

module.exports = profileRouter;

