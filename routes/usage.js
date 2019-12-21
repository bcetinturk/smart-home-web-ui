const express = require("express")

const router = express.Router()

router.post("/new-data", (req, res)=>{
    console.log(req.body)
    res.send("k")
})

module.exports = router