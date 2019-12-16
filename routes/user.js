const express = require("express")
const passport = require("passport")
const router = express.Router()

router.get("/login", (req, res)=>{
    res.render("login")
})

router.post("/login", passport.authenticate("local", {failureRedirect: "/login"}), 
    (req, res)=>{
    res.redirect(`/user/${req.user._id}`)
})

router.get("/user/:id", (req, res)=>{
    res.render("index")
})

module.exports = router