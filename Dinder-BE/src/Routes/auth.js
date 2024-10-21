const express = require('express');
const bcrypt = require("bcrypt");  
const User = require("../models/user");
const userAuth = require('../middlewares/Auth');

const authRouter = express.Router();
//signup user
authRouter.post("/signup",async(req,res)=>{
    //encrypting the password
    const {firstName, emailId, password} = req.body;
    const passwordHash = await bcrypt.hash(password,10);
    try{
    const user = new User({
        firstName,
        emailId,
        password: passwordHash
    });
    await user.save();
    res.send("user added");
    }
    catch(err){
        if (err.code === 11000) {
            res.status(404).send("Email already exists");
        }else{
        res.status(404).send("something went wrong! " + err);
        }
    }
});

//login user
authRouter.post('/login',async(req,res)=>{
    try {
    const {emailId, password} = req.body;
    if (!emailId || !password) {
        throw new Error("Email and password are required");
    }
    const user = await User.findOne({emailId: emailId});
    if(!user){
        throw new Error("User not found");
    }
    const isMatch = user.validatePassword(password);
    if(!isMatch){
        throw new Error("Invalid credentials");
    }else{
        const token = user.getJWTToken();
        //send it to client inside cookie
        res.cookie("token", token,{expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
    }
    res.send("Login successful");
    }catch(err){
        res.status(404).send("something went wrong! " + err);
    }
});

//logout user
authRouter.post("/logout", (req,res)=>{
    res.cookie("token", null, {expires: new Date(Date.now())})
    .send("Logout successful");
});

//update password

module.exports = authRouter;