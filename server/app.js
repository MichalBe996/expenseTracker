const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const mongoSanitize = require("express-mongo-sanitize")
const xss = require("xss-clean")
const rateLimit = require("express-rate-limit")
const helmet = require("helmet")
const hpp = require("hpp")
/// import user and data routes here


const app = express()
// 1 ) GLOBAL MIDDLEWARES 


// Securing the http headers 
app.use(helmet())

// Limiting the number of http request per one IP in 1 hour timeframe
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 100,
    message: "Too many requests from this IP adress, please try again later"
})

app.use("/api", limiter)
app.use(express.json())

// Data sanitization againt NoSQL query injections
app.use(mongoSanitize());

// Data sanitization against XSS attacks

app.use(xss())








module.exports = app;