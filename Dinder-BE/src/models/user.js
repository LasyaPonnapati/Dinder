const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: [true, "your FirstName is mandatory to enter"], trim: true, minLength:[2,"minimum of 2 characters are required for the firstname"],maxLength: [50, "maximum length allowed is 50 characters, please shorten it"] },
    lastName: { type: String, trim: true },
    emailId: { type: String, required: [true, "your emailId is mandatory to enter"], lowercase: true, trim: true },
    password: { type: String, required: [true, "your password is mandatory to enter"], trim: true, minLength: [8,"minimum length of password should be 8"], maxLength: [12,"maximum length of password should be 12"] },
    age: { type: Number, min: 0 },
    gender: { type: String, validate(value){if(!['male','female','others'].includes(value)){throw new erorr("gender invalid")}} }, //validate function only works when new doc is inserted 
    dpUrl: { type: String, default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"},
    descripton: { type: String, maxLength: 100, trim: true },
    skills: { type: [String], default: [] },
}, {timestamps: true});


module.exports = mongoose.model("User", userSchema);

//schema -> model