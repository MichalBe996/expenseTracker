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




exports.signup = async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role
    })
    
    try {
        res.status(201).json({
            status: "Success",
            data: {
                name: newUser.name,
                email: newUser.email,
                token: signToken(newUser._id)
            }
        })
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error
        })
    }

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

exports.getAllData = async (req, res, next) => {
    try {
        const allUsers = await User.find()
        res.status(200).json({
            status: "Success", 
            data: allUsers
        })
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: error
        })
    }
}