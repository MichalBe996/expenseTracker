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








module.exports = app;