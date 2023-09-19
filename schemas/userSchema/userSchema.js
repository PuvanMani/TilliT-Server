const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');


const userSchema = new mongoose.Schema({
    FullName: {
        type: String,
        required: [true, "Please Enter Name"]
    },
    Email: {
        type: String,
        required: [true, "Please Enter Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter Valid Email"]
    },
    Password: {
        type: String,
        required: [true, "Please Enter Password"],
        maxlength: [6, "Password Cannot Exceed 6 Characters"],
        select: false
    },
    role: {
        type: String,
        default: 'user'
    },
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date,
    CreatedDate: {
        type: Date,
        default: Date.now()
    }

})
userSchema.pre('save', async function (next) {
    if (!this.isModified("Password")) {
        next()
    }
    this.Password = await bcrypt.hash(this.Password, 10)
})

userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    })
}
userSchema.methods.isValidPassword = async function (Password) {
    console.log(Password, this.Password)
    return await bcrypt.compare(Password, this.Password)
}

userSchema.methods.getResetToken = async function () {

    const token = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000;

    return token
}

module.exports = mongoose.model("User", userSchema);