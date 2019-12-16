require("dotenv").config()
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const express = require("express")
const mongoose = require("mongoose")
const LocalStrategy = require('passport-local').Strategy;
const passport = require("passport")
const path = require("path")
const session = require("express-session")
const Device = require("./models/device.model")
const User = require("./models/user.model")
const Usage = require("./models/usage.model")
const userRouter = require("./routes/user")

const mongoURI = "mongodb://localhost:27017/test"
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=> console.log("connection to mongodb was successful"))
.catch(err => console.log("error occured:", err))

passport.use(new LocalStrategy(
    function(username, password, done){
        User.findOne({username}, function(err, user){
            if(err) { return done(err)}
            if(!user) { return done(null, false)}
            if(!user.comparePassword(password)){return done(null, false)}
            return done(null, user)
        })
    }))
passport.serializeUser(function(user, done){
    done(null, user)
})
passport.deserializeUser(function(user,done){
    done(null, user)
})

const app = express()
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(userRouter)

app.set("views", path.join(__dirname, "/templates/views"))
app.set("view engine", "pug")

const port = process.env.PORT || 3000
app.listen(port, ()=>{
    console.log("app listening on", port)
})