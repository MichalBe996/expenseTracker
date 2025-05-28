const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config({path: "./config.env"})
const app = require("./app")



const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD)

mongoose.connect(DB, {
    retryWrites: false
})
    .then(()=> console.log("DB connected succesfully..."))

const port = 5000 || process.env.port


app.listen(port, ()=> {
    console.log(`Server listening on port ${port}...`)
})