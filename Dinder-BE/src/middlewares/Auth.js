const User = require("../models/user");
const jwt = require('jsonwebtoken');

const userAuth = async(req,res,next)=>{
    try{
    const token = req.cookies.token;
    if(!token){
        throw new Error("Token not found");
    }
    const decodedObj = jwt.verify(token, 'dinder-be@12345');
    const user = await User.findById(decodedObj._id);
    if(!user){
        throw new Error("User not found");
    }
    req.user = user;
    next();
    } catch(err){
        res.status(404).send("something went wrong"+ err);
    }
};

module.exports = userAuth;