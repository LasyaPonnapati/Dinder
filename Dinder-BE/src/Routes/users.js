const express = require('express');
const User = require("../models/user");
const userAuth = require('../middlewares/Auth');

const usersRouter = express.Router();

//get feed
usersRouter.get("/feed", userAuth, async(req,res)=>{
    try{
        const users = await User.find({});
        res.send(users);
    }
    catch(err){
        res.status(404).send("something went wrong! "+ err);
    }
});

//delete user 
usersRouter.delete("/delete-user", userAuth, async(req,res)=>{
    try{
        await User.deleteMany({firstName:req.body.firstName});
        res.send("users deleted successfully");
    }
    catch(err){
        res.status(404).send("something went wrong! "+ err);
    }
});

module.exports = usersRouter;