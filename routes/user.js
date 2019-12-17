const express = require("express")
const passport = require("passport")
const User = require("../models/user.model")
const Usage = require("../models/usage.model")
const moment = require("moment")

const router = express.Router()
router.get("/login", (req, res)=>{
    res.render("login")
})

router.post("/login", passport.authenticate("local", {failureRedirect: "/login"}), 
    (req, res)=>{
    res.redirect(`/user/${req.user._id}`)
})

router.get("/user/:id", async (req, res)=>{
    const usage = await Usage.findOne({user: req.params.id, created: moment().format("DD/MM/YYYY")})
                        .populate({
                            path: "user",
                            populate: {
                                path: "houseware.device"
                            }
                        })

    const labels = Object.keys(usage.grid)
    const grid = Object.values(usage.grid)
    const renewable = Object.values(usage.renewable)
    
    const bill = grid.reduce((t, g, i)=>{
        let cost
        if( moment(labels[i], "HH:mm").isBetween(moment("00:00", "HH:mm"), moment("08:00", "HH:mm")) ){
            cost = 0.3715
        } else if( moment(labels[i], "HH:mm").isBetween(moment("08:00", "HH:mm"), moment("16:00", "HH:mm")) ){
            cost = 0.6361
        } else {
            cost = 0.1599
        }

        return t + g*cost
    }, 0)

    res.render("index", {
        devices: usage.user.houseware,
        apartment: usage.user.apartment,
        labels,
        grid,
        renewable,
        bill
    })
})

module.exports = router