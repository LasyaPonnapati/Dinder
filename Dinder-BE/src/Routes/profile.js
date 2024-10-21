const express = require("express");
const User = require("../models/user");
const userAuth = require('../middlewares/Auth');
const {validateUpdate} = require("../helpers/validation");

const profileRouter = express.Router();

//get user profile
profileRouter.get("/myprofile", userAuth, async(req,res)=>{
    try{
        const user = req.user
        res.send(user);
    }
    catch(err){
        res.status(404).send("something went wrong! "+ err);
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
        res.send("updated successfully");
    }
    catch(err){
        res.status(404).send("something went wrong! "+ err);
    }
});

module.exports = profileRouter;

