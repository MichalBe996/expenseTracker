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
userSchema.pre("save", async function(next){
    // Only run this function if password was modified
    if(!this.isModified("password")){
        return next();
    };
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    // Delete password confirm field
    this.passwordConfirm = undefined;
    next();
})

userSchema.pre("save", function(next){
    if(!this.isModified('password') || this.isNew ){
        return next();
    }
    /// substracting 1 milisecond from the date so that the token is always created after the password has been changed
    this.passwordChangedAt = Date.now() - 1000;
    next();

})

const User = mongoose.model("User", userSchema)


module.exports = User;
