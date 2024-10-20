const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: [true, "your First Name is mandatory to enter"], trim: true, 
                minLength:[2,"minimum of 2 characters are required for the first name"],
                maxLength: [50, "maximum length allowed is 50 characters, please shorten it"],
                validate: {
                    validator: function(value) {
                        return validator.isAlpha(value, 'en-US', { ignore: ' ' });
                    },
                    message: "First name should contain only alphabets and spaces"
                } 
    },
    lastName: { type: String, trim: true,
                validate: {
                    validator: function(value) {
                        return validator.isAlpha(value, 'en-US', { ignore: ' ' });
                    },
                    message: "Last name should contain only alphabets and spaces"
                }
    },
    emailId: { type: String, required: [true, "your emailId is mandatory to enter"], lowercase: true, trim: true, unique:true,
        validate: {
            validator: function(value) {
                return validator.isEmail(value);
            },
            message: "Please enter a valid email address"
        }
    },
    password: { type: String, required: [true, "your password is mandatory to enter"], trim: true,
        validate: {
            validator: function(value) {
                return validator.isStrongPassword(value);
            },
            message: "Please enter a strong password"
    } },
    age: { type: Number, min: [0, "Age should be positive"], max: [150, "please enter correct age"]},
    gender: { type: String, validate(value){if(!['male','female','others'].includes(value)){throw new erorr("gender invalid")}} }, //validate function only works when new doc is inserted 
    dpUrl: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
        validate: {
            validator: function(value) {
                return validator.isURL(value);
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
        validate:{validator: function(value){return value.length <= 10;},message: "You can only add up to 10 skills."}
     },
}, {timestamps: true});


module.exports = mongoose.model("User", userSchema);

//schema -> model