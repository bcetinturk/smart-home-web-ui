const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    apartment: Number,
    houseware: Object,
})

UserSchema.pre("save", async function(next){
    let user = this

    if(!user.isModified("password")) return next()
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(user.password, 10)

    user.password = hash
    console.log(hash)
    next()
})

UserSchema.methods.comparePassword = function(password){
    const user = this
    return bcrypt.compare(password, user.password)
}

const User = mongoose.model("User", UserSchema)

module.exports = User