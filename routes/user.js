const express = require("express")
const passport = require("passport")
const router = express.Router()
const User = require("../models/user.model")

router.get("/login", (req, res)=>{
    res.render("login")
})

router.post("/login", passport.authenticate("local", {failureRedirect: "/login"}), 
    (req, res)=>{
    res.redirect(`/user/${req.user._id}`)
})

router.get("/user/:id", async (req, res)=>{
    const user = await User.findById(req.params.id)
                        .populate("houseware.device")
    console.log(user.houseware)

    res.render("index", {devices: user.houseware})
})

module.exports = router