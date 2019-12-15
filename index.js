const mongoose = require("mongoose")
const User = require("./models/user.model")
const Usage = require("./models/usage.model")

const mongoURI = "mongodb://localhost:27017/test"

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=> console.log("connection to mongodb was successful"))
.catch(err => console.log("error occured:", err))