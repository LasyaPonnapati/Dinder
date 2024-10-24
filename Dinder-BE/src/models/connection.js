const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {values: ["interested", "ignored", "accepted", "rejected", "pending"],
                message: "Invalid status!"
        }
    }
}, {timestamps: true});

//compound index
userSchema.index({senderId: 1, receiverId: 1});

//middleware
connectionRequestSchema.pre("save",function (next){
 const connectionRequest = this;
 if(connectionRequest.senderId.equals(connectionRequest.receiverId)){
    throw new Error("you cannot send a connection request to yourself!");
 }
 next();
})

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);