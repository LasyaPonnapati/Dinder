const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: [true, "your First Name is mandatory to enter"], trim: true, 
                minLength:[2,"minimum of 2 characters are required for the first name"],
                maxLength: [50, "maximum length allowed is 50 characters, please shorten it"],
                validate: {
                    validator: function(value) {
                        const regex = /^[a-zA-Z\s]+$/;
                        return regex.test(value);
                    },
                    message: "First name should contain only alphabets and spaces"
                } 
    },
    lastName: { type: String, trim: true,
                validate: {
                    validator: function(value) {
                        const regex = /^[a-zA-Z\s]+$/;
                        return regex.test(value);
                    },
                    message: "Last name should contain only alphabets and spaces"
                }
    },
    emailId: { type: String, required: [true, "your emailId is mandatory to enter"], lowercase: true, trim: true,
        validate: {
            validator: function(value) {
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                return emailRegex.test(value);
            },
            message: "Last name should contain only alphabets and spaces"
        }
    },
    password: { type: String, required: [true, "your password is mandatory to enter"], trim: true, 
        minLength: [8,"minimum length of password should be 8"], 
        maxLength: [12,"maximum length of password should be 12"],
        validate: {
            validator: function(value) {
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,12}$/;
                return passwordRegex.test(value);
            },
            message: "Last name should contain only alphabets and spaces"
    } },
    age: { type: Number, min: [0, "Age should be positive"], max: [100, "Age shouldn't be more than 100"]},
    gender: { type: String, validate(value){if(!['male','female','others'].includes(value)){throw new erorr("gender invalid")}} }, //validate function only works when new doc is inserted 
    dpUrl: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
        validate: {
            validator: function(value) {
                const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}([\/\w .-]*)*\/?$/;
                return urlRegex.test(value);
            },
            message: "Please enter a valid URL"
        }
    },
    description: {
        type: String,
        maxLength: 100,
        trim: true,
        validate: {
            validator: function(value) {
                // Modify the regex as per your requirements
                const descriptionRegex = /^[a-zA-Z0-9\s.,!?'-]*$/;
                return descriptionRegex.test(value);
            },
            message: "Description can only contain letters, numbers, spaces, and the following punctuation: . , ! ? ' -"
        }
    },
    skills: { type: [String], default: [],
        validate:{function(value){return value.length <= 10;},message: "You can only add up to 10 skills."}
     },
}, {timestamps: true});


module.exports = mongoose.model("User", userSchema);

//schema -> model