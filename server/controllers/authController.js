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
        role: req.body.role,
    
    })
    
    try {
        res.status(201).json({
            status: "Success",
            data: newUser,
            token: signToken(newUser._id)
        })
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error
        })
    }

}
