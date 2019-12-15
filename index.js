const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const express = require("express")
const path = require("path")
const User = require("./models/user.model")
const Usage = require("./models/usage.model")
const userRouter = require("./routes/user")

const mongoURI = "mongodb://localhost:27017/test"
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=> console.log("connection to mongodb was successful"))
.catch(err => console.log("error occured:", err))

const app = express()
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(userRouter)

app.set("views", path.join(__dirname, "/templates/views"))
app.set("view engine", "pug")

const port = process.env.PORT || 3000
app.listen(port, ()=>{
    console.log("app listening on", port)
})