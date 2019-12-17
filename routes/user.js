const express = require("express")
const passport = require("passport")
const User = require("../models/user.model")
const Usage = require("../models/usage.model")

const router = express.Router()
router.get("/login", (req, res)=>{
    res.render("login")
})

router.post("/login", passport.authenticate("local", {failureRedirect: "/login"}), 
    (req, res)=>{
    res.redirect(`/user/${req.user._id}`)
})

router.get("/user/:id", async (req, res)=>{
    const usage = await Usage.findOne({user: req.params.id})
                        .populate({
                            path: "user",
                            populate: {
                                path: "houseware.device"
                            }
                        })
    console.log(usage)

    const labels = Object.keys(usage.grid)
    const grid = Object.values(usage.grid)
    const renewable = Object.values(usage.renewable)

    res.render("index", {
        devices: usage.user.houseware,
        apartment: usage.user.apartment,
        labels,
        grid,
        renewable
    })
})

module.exports = router