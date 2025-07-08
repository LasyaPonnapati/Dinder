const express = require("express");
const User = require("../models/user");
const userAuth = require('../middlewares/auth');
const {validateUpdate} = require("../helpers/validation");

const profileRouter = express.Router();

//get user profile
profileRouter.get("/myprofile", userAuth, async(req,res)=>{
    try{
        const userId = req.user._id;
        const loggedInUser = await User.findById(userId)
            .select("firstName lastName emailId age gender dpUrl description skills"); 
        res.status(200).json({loggedInUser: loggedInUser});
    }
    catch(err){
        res.status(500).json({message: `something went wrong! ${err.message}`});
    }
});

//update user profile
profileRouter.patch("/update-user", userAuth, async(req,res)=>{
    try{
        //never trust req.body
        const isUpdateAllowed = validateUpdate(req.body);
        if(!isUpdateAllowed){
            throw new Error("Invalid edit request");
        }
        loggedInUser = req.user;
        Object.keys(req.body).forEach((key)=>{loggedInUser[key] = req.body[key]});
        await loggedInUser.save();
        res.status(200).json({message: "updated successfully", updatedUserDetails: loggedInUser});
    }
    catch(err){
        res.status(500).json({message: `something went wrong! ${err.message}`});
    }
});

module.exports = profileRouter;

