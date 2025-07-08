const mongoose = require("mongoose");

const otpSchema = mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    otp:{
        type: String,
        required: true,
        minLength: [6, "Invalid OTP! OTP should be a 6-digit number."],
    },
    expires:{
        type: Number,
        default: 300, 
        required: true,
    },
    isValidated:{
        type: Boolean,
        default: false,
        required: true
    }
});

module.exports = mongoose.model("Otp", otpSchema);