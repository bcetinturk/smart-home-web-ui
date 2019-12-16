const mongoose = require("mongoose")

const DeviceSchema = mongoose.Schema({
    display: String,
    iconName: String
})

const Device = mongoose.model("Device", DeviceSchema)

module.exports = Device