const express = require('express');
const bcrypt = require("bcrypt");  
const User = require("../models/user");
const {sendOTPtoEmail, generateOTP, validateOTP} = require("../helpers/otphelper");
const OtpModel = require("../models/otp");

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
authRouter.post("/send-otp", async(req,res)=>{
    try{
    const user = await User.findOne({emailId: req.body.emailId});
    if(!user){
        throw new Error("User not found");
    }
    const otpGenerated = generateOTP();
    const otpRefer = new OtpModel({userId: user._id, otp: otpGenerated});
    await otpRefer.save();
    sendOTPtoEmail(otpRefer, user, res);
    }catch(err){
        res.status(404).send("something went wrong! " + err);
    }
});

authRouter.post("/verify-otp", async(req, res) => {
    try{
    const { email, otp } = req.body;
    const user = await User.findOne({ emailId: email });
    const userEnteredOTP = otp;
    const systemSavedOTPModel = await OtpModel.findOne({ userId: user._id });
    const isOTPValid = validateOTP(userEnteredOTP, systemSavedOTPModel);
    if (!isOTPValid) {
        throw new Error("Invalid OTP");
    } 
    res.send("OTP verified successfully");
    }catch(err){
        res.status(404).send("something went wrong! " + err);
    }
});

authRouter.patch("/update-password", async (req,res)=>{
    try{
    const {email, newPassword} = req.body;
    const user = await User.findOne({emailId: email});
    user.password = newPassword;
    await user.save();
    res.send("Password updated successfully");
    }catch(err){
        res.status(404).send("something went wrong! " + err);
    }
});

module.exports = authRouter;