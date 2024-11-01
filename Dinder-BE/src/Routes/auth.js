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
    res.status(200).json({ message: "User added successfully!", user: user });
    }
    catch(err){
        if (err.code === 11000) {
            res.status(400).json({message: "Email already exists!"});
        }else{
        res.status(500).json({message: `something went wrong! ${err.message}`});
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
    const isMatch = await user.validatePassword(password);
    if(!isMatch){
        throw new Error("Invalid credentials");
    }else{
        const token = user.getJWTToken();
        //send it to client inside cookie
        res.cookie("token", token,{expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
    }
    res.status(200).json({message:"Login successful", user: user});
    }catch(err){
        res.status(500).json({message: `something went wrong! ${err.message}`});
    }
});

//logout user
authRouter.post("/logout", (req,res)=>{
    res.cookie("token", null, {expires: new Date(Date.now())})
    .json({message:"Logout successful"});
});

//update password
authRouter.post("/send-otp", async(req,res)=>{
    try{
    const user = await User.findOne({emailId: req.body.emailId});
    if(!user){
        throw new Error("User not found");
    }
    await OtpModel.deleteMany({ userId: user._id });
    const otpGenerated = generateOTP();
    const expiresIn = 300 * 1000;
    const otpRefer = new OtpModel({
        userId: user._id,
        otp: otpGenerated,
        expires: Date.now() + expiresIn
    });
    await otpRefer.save();
    sendOTPtoEmail(otpGenerated, user, res);  
    }catch(err){
        res.status(500).json({error: `something went wrong! ${err.message}`});
    }
});

authRouter.post("/verify-otp", async(req, res) => {
    try{
    const { email, otp } = req.body;
    const user = await User.findOne({ emailId: email });
    if(!user){
        throw new Error("User not found");
    }
    const userEnteredOTP = otp;
    const systemSavedOTPModel = await OtpModel.findOne({ userId: user._id });
    if(!systemSavedOTPModel){
        throw new Error("OTP not found");
    }
    const isOTPValid = validateOTP(userEnteredOTP, systemSavedOTPModel);
    if (!isOTPValid) {
        throw new Error("Invalid OTP");
    }
    systemSavedOTPModel.isValidated = true;
    await systemSavedOTPModel.save();
    res.status(200).json({message: "OTP verified successfully"});
    }catch(err){
        res.status(500).json({message: `something went wrong! ${err.message}`});
    }
});

authRouter.patch("/update-password", async (req,res)=>{
    try{
    const {email, newPassword} = req.body;
    const user = await User.findOne({emailId: email});
    if(!user){
        throw new Error("User not found");
    }
    const otpModel = await OtpModel.findOne({userId: user._id});
    if(!otpModel){
        throw new Error("OTP not found");
    }
    const isOTPValidated = otpModel.isValidated;
    if(!isOTPValidated){
        throw new Error("password update not allowed!");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    console.log(user);
    await otpModel.deleteOne({userId: user._id});
    res.cookie("token", null, {expires: new Date(Date.now())}).status(200)
    .json({message:"password updated successfully! please login again!"});
    }catch(err){
        res.status(500).json({message: `something went wrong! ${err.message}`});
    }
});

module.exports = authRouter;