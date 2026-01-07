var mongoose = require('mongoose')
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

var userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is Required"]
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: [true, "email should be unique"],
        lowercase: true,
        trim: true,
        match: [emailRegex, "Email should be valid"]
    },
    password: {
        type: String,
        required: [true, "password is required"],
        trim: true,
        minlength: 6
    },
})

var UserModel = mongoose.model("Users", userSchema)

module.exports = UserModel