const express = require("express")
const moment = require("moment")
const User = require("../models/user.model")
const Usage = require("../models/usage.model")

const router = express.Router()

router.post("/new-data", (req, res)=>{
    console.log(req.body)
    res.send("k")
})

router.post("/get-data/user/:id", async (req, res)=>{
    const hourLabels = new Array(24).fill(undefined).map((v, i)=>
        moment().startOf("day").add(1+i, "hour").format("HH:mm")
    )
    const dayLabels = new Array(31).fill(undefined).map((v, i)=>
        moment().startOf("month").add(i, "day").format("DD/MM")
    )
    const pattern = new RegExp(`\/${moment().month()+1}\/`)


    console.log(req.body.val)
    if(req.body.val === "monthly"){
        const pattern = new RegExp(`\/${moment().month()+1}\/`)
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

        return res.send({
            labels: dayLabels,
            grid,
            renewable,
            gridTotal,
            renewableTotal,
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

        return res.send({
            labels: hourLabels,
            grid,
            renewable,
            gridTotal,
            renewableTotal,
            bill: bill
        })
    }

    return res.send({
        labels: hourLabels,
        grid: [],
        renewable: [],
        gridTotal: 0,
        renewableTotal: 0,
        bill: 0
    })
})

module.exports = router