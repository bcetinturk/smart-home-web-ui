const mongoose = require("mongoose")
const moment = require("moment")

const UsageSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    created: {type: Date, default: Date.now},
    grid: Object,
    renewable: Object
})

const Usage = new mongoose.model("Usage", UsageSchema)

module.exports = Usage