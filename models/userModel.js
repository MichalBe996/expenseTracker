const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const crypto = require("crypto")



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Username must be provided"]
    },
    email: {
        type: String,
        required: [true, "User email must be provided"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide an email in a correct format."]
    },
    role: {
        type: String,
        enum: ["admin", "user", "moderator"],
        default: "user"
    },
    password: {
        type: String,
        minlength: 8,
        required: [true, "Password must be provided"],
        select: false,

    },
    passwordConfirm: {
        type: String,
        required: [true, "You must confirm password"],
        validate: {
            validator: function(el){
                return el === this.password
            },
            message: "Passwords are not the same"
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: String,
    userExpenses: Array
})

