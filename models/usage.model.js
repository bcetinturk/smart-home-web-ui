const mongoose = require("mongoose")
const moment = require("moment")

const UsageSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    created: {type: String, default: moment().format("DD/MM/YYYY")},
    grid: Object,
    renewable: Object
})

const Usage = new mongoose.model("Usage", UsageSchema)

module.exports = Usage