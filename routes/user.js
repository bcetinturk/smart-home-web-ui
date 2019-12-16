const express = require("express")
const passport = require("passport")
const router = express.Router()
const User = require("../models/user.model")
const mongoose = require("mongoose")

router.get("/login", (req, res)=>{
    res.render("login")
})

router.post("/login", passport.authenticate("local", {failureRedirect: "/login"}), 
    (req, res)=>{
    res.redirect(`/user/${req.user._id}`)
})

router.get("/user/:id", async (req, res)=>{
    const user = await User.aggregate([
        {$match: {_id: mongoose.Types.ObjectId(req.params.id)}},
        {$lookup: {from: "devices", localField: "houseware.device", foreignField: "_id", as: "devices"}}
    ])
    console.log(user[0])

    res.render("index", {devices: user[0].devices})
})

module.exports = router