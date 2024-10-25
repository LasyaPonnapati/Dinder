const express = require('express');
const User = require("../models/user");
const connectionRequest = require("../models/connection");
const userAuth = require('../middlewares/auth');

const usersRouter = express.Router();

//get requests
usersRouter.get("/sent", userAuth, async (req, res)=>{
    try{
        const loggedInUser = req.user;
        const user = await User.findById(loggedInUser._id);
        const connectionRequests = await connectionRequest.find({senderId: user._id, status: "interested"})
        .populate("receiverId", ["firstName", "lastName", "dpUrl"]);
        res.send(connectionRequests);
    }catch(err){
        res.status(404).send("something went wrong! "+ err);
    }
});
usersRouter.get("/received", userAuth, async (req, res)=>{
    try{
        const loggedInUser = req.user;
        const user = await User.findById(loggedInUser._id);
        const connectionRequests = await connectionRequest.find({receiverId: user._id, status: "interested"})
        .populate("senderId", ["firstName", "lastName", "dpUrl", "gender", "age", "description", "skills"]);
        res.send(connectionRequests);
    }catch(err){
        res.status(404).send("something went wrong! "+ err);
    }
});

//get connections
usersRouter.get("/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connections = await connectionRequest.find({
            $or: [
                { senderId: loggedInUser._id, status: "accepted" },
                { receiverId: loggedInUser._id, status: "accepted" }
            ]
        })
        .populate("senderId", ["firstName", "lastName", "dpUrl"])
        .populate("receiverId", ["firstName", "lastName", "dpUrl"]);

        const data = connections.map((connection)=>{
            if(connection.senderId._id.toString() === loggedInUser._id.toString()){
                return connection.receiverId;
            }
            return connection.senderId;
        })
        
        res.send(data);
    } catch (err) {
        res.status(404).send("Something went wrong! " + err);
    }
});



//get feed 
usersRouter.get("/feed", userAuth, async (req, res)=>{
    try{
        const loggedInUser = req.user;
        const connections = await connectionRequest.find({$or:[{senderId: loggedInUser._id},{receiverId: loggedInUser._id}]});
        const connectionIds = connections.map((connection)=>{
            return connection.senderId._id.toString() === loggedInUser._id.toString() ? connection.receiverId._id.toString() : connection.senderId._id.toString();
        });
        const feed = await User.find({
            _id: { $nin: [...connectionIds, loggedInUser._id] }
        }).select("firstName lastName dpUrl gender age description skills");
        res.send(feed);
    }catch(err){
        res.status(404).send("something went wrong! "+ err);
    }
});

module.exports = usersRouter;