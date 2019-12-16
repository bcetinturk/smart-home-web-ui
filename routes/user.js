const express = require("express")
const passport = require("passport")
const router = express.Router()

router.get("/login", (req, res)=>{
    res.render("login")
})

router.post("/login", passport.authenticate("local", {failureRedirect: "/login"}), 
    (req, res)=>{
        console.log(req.body)
    res.redirect(`/user/${req.user._id}`)
})

router.get("/user/:id", (req, res)=>{
    if(req.isAuthenticated()){
        return res.render("index")
    }
})

module.exports = router