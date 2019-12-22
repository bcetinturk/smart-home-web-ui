const express = require("express")
const passport = require("passport")
const User = require("../models/user.model")
const Usage = require("../models/usage.model")
const moment = require("moment")

const router = express.Router()
router.get("/", (req, res)=>{
    res.redirect("/login")
})

router.get("/login", (req, res)=>{
    res.render("login")
})

router.post("/login", passport.authenticate("local", {failureRedirect: "/login"}), 
    (req, res)=>{
    res.redirect(`/user/${req.user._id}`)
})

router.get("/user/:id", async (req, res)=>{
    const monthlySelected = req.query.p==="monthly"
    const hourLabels = new Array(24).fill(undefined).map((v, i)=>
        moment().startOf("day").add(1+i, "hour").format("HH:mm")
    )
    const dayLabels = new Array(31).fill(undefined).map((v, i)=>
        moment().startOf("month").add(i, "day").format("DD/MM")
    )
    const pattern = new RegExp(`\/${moment().month()+1}\/`)

    const user = await User.findById(req.params.id)
                            .populate("houseware.device")

    let usage
    if(monthlySelected){
        usage = await Usage.find({
            user: req.params.id,
            created: {$regex: pattern, $options: "i"}
        }).lean()

        const monthBill=usage.reduce((tot, obj)=>{
            const grid = Object.values(obj.grid)

            const bill = grid.reduce((t, g, i)=>{
                let cost
                if( moment(hourLabels[i], "HH:mm").isBetween(moment("00:00", "HH:mm"), moment("08:00", "HH:mm")) ){
                    cost = 0.3715
                } else if( moment(hourLabels[i], "HH:mm").isBetween(moment("08:00", "HH:mm"), moment("16:00", "HH:mm")) ){
                    cost = 0.6361
                } else {
                    cost = 0.1599
                }
        
                return t + g*cost
            }, 0)

            return tot+bill
        }, 0)

        let i=0
        const grid = dayLabels.map((v)=>{
            if(usage[i] && moment(usage[i].created, "DD/MM/YYYY").isSame(moment(v, "DD/MM"), "day")){
                const a = Object.values(usage[i].grid).reduce((t, v)=>t+v, 0)
                i= i+1
                return a
            }else {
                return 0
            }
        })

        const gridTotal = grid.reduce((t, v)=> t+v, 0).toFixed(2)
        
        i=0
        const renewable = dayLabels.map((v)=>{
            if(usage[i] && moment(usage[i].created, "DD/MM/YYYY").isSame(moment(v, "DD/MM"), "day")){
                const a = Object.values(usage[i].renewable).reduce((t, v)=>t+v, 0)
                i= i+1
                return a
            }else {
                return 0
            }
        })

        const renewableTotal = renewable.reduce((t, v)=> t+v, 0).toFixed(2)
        return res.render("index", {
                    devices: user.houseware,
                    apartment: user.apartment,
                    labels: dayLabels,
                    grid,
                    renewable,
                    gridTotal,
                    renewableTotal,
                    monthlySelected,
                    bill: monthBill
                })
    }

    usage = await Usage.findOne({
        user: req.params.id,
        created: moment().format("DD/MM/YYYY")
    })
    if(usage){
        const grid = Object.values(usage.grid)
        const renewable = Object.values(usage.renewable)

        const bill = grid.reduce((t, g, i)=>{
            let cost
            if( moment(hourLabels[i], "HH:mm").isBetween(moment("00:00", "HH:mm"), moment("08:00", "HH:mm")) ){
                cost = 0.3715
            } else if( moment(hourLabels[i], "HH:mm").isBetween(moment("08:00", "HH:mm"), moment("16:00", "HH:mm")) ){
                cost = 0.6361
            } else {
                cost = 0.1599
            }
    
            return t + g*cost
        }, 0)

        const gridTotal = grid.reduce((a,b)=>a+b).toFixed(2)
        const renewableTotal = renewable.reduce((a,b)=>a+b).toFixed(2)

        return res.render("index", {
            devices: user.houseware,
            apartment: user.apartment,
            labels: hourLabels,
            grid,
            renewable,
            gridTotal,
            renewableTotal,
            monthlySelected,
            bill
        })
    }
                            
    res.render("index", {
        devices: user.houseware,
        apartment: user.apartment,
        labels: hourLabels,
        grid: [],
        renewable: [],
        gridTotal: 0,
        renewableTotal: 0,
        monthlySelected,
        bill: 0
    })
    
})

module.exports = router