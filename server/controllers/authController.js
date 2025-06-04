const User = require("../models/userModel")
const crypto = require("crypto")
const { promisify } = require("util")
const jwt = require("jsonwebtoken")
const AppError = require("../utils/AppError")


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}


const createAndSendToken = (user, statusCodeSuccess, statusCodeError, res) => {
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: false
    }
    try {
        const token = signToken(user._id)
        if(process.env.NODE_ENV=== "production"){
            cookieOptions.secure = true;
        }
        res.cookie("jwt", token, cookieOptions)
        user.password = undefined;
        res.status(statusCodeSuccess).json({
            status: "Success",
            token,
            data: user
        })
    } catch (error) {
        res.status(statusCodeError).json({
            status: "Fail",
            message: error
        })
    }
}

exports.signup = async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role
    })
    createAndSendToken(newUser, 201, 400, res)
}

exports.login = async (req, res, next) => {
    // getting credentials from object's body
    const {email, password} = req.body
    // 1) Check if email and password exist
    if(!email || !password){
        return next(new AppError("Please provide email and password!", 400))
    }
    // 2) Check if user exists and password is correct
    const user = await User.findOne({email}).select("+password")
        // using the password comparing method declared in user model 
    if(!user || !(await user.correctPassword(password, user.password))){
        res.status(401).json({
            status: "Failed",
            message: "Wrong email or password"
        })
    }

    // 3) If everything is okay, send the token to user
    createAndSendToken(user, 201, 400, res)

}