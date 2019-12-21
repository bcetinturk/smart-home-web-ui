const mongoose = require("mongoose")

const DeviceSchema = mongoose.Schema({
    display: String,
    iconName: String,
    canRunAtNight: Boolean
})

const Device = mongoose.model("Device", DeviceSchema)

module.exports = Device