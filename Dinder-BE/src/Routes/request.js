const express = require("express");
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connection");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post("/:status/:receiverId", userAuth, async(req,res)=>{
    try{
    const senderId = req.user._id;
    const receiverId = req.params.receiverId;
    const status = req.params.status;

    //for this API allowed status are "interested", "ignored"
    const ALLOWED_STATUS = ["interested", "ignored"];
    if(!ALLOWED_STATUS.includes(status)){
        throw new Error("Invalid status!");
    }

    //checking if receiverId is valid or not
    const user = await User.findById(receiverId);
    if(!user){
        throw new Error("User not found!");
    }

    //checking if connection request already exists
    const isConnectionAlreadyExist = await ConnectionRequest.findOne(
        {$or: [
            {senderId, receiverId},
            {senderId: receiverId, receiverId: senderId}
        ]
        });
        if(isConnectionAlreadyExist){
            throw new Error("Connection request already exists!");
        }

    const connectionRequest = new ConnectionRequest({senderId, receiverId, status});

    await connectionRequest.save();
    res.send("connection request sent successfully!");
    }catch(err){
        res.status(404).send("something went wrong! " + err);
    }
});

requestRouter.post("/review/:status/:requestId", userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const {status, requestId} = req.params;

        //validations
        const ALLOWED_STATUS = ["accepted", "rejected"];
        if(!ALLOWED_STATUS.includes(status)){
            throw new Error("Invalid status!");
        } 
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId, 
            receiverId: loggedInUser._id, 
            status: "interested"});

        if(!connectionRequest){
            throw new Error("connectionRequest not found!");
        }

        connectionRequest.status = status;
        await connectionRequest.save();
        res.send(`connection request ${status} successfully!`);
        
    }catch(err){
        res.status(404).send("something went wrong! " + err);
    }
});

module.exports = requestRouter;