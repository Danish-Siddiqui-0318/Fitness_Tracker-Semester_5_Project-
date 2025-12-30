var UserModel = require('../models/user_model')
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')

// register acoount 
async function registerUser(req, res) {
    var { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(400)
        throw new Error("Plase Provide the fields")
    }
    var userExist = await UserModel.findOne({ email })
    if (userExist) {
        res.status(400)
        throw new Error("this email is already registered")
    }
    var salt = bcrypt.genSalt(10)
    var encryptedPassword = await bcrypt.hash(password, salt)
    var userData = await UserModel.create({
        name,
        email,
        password: encryptedPassword
    })

    res.status(201).json({
        success: true,
        message: "Account is Created",
        data: userData
    })
}

async function loginUser(req, res) {
    try {
        var { email, password } = req.body;
        if (!email || !password) {
            res.status(400)
            throw new Error("Please Provide all the fields")
        }
        var user = await UserModel.findOne({ email })
        if (!user) {
            res.status(400)
            throw new Error("User Not Exist")
        }

        var ismMatched = await bcrypt.compare(password, user.password)
        if (!ismMatched) {
            res.status(400)
            throw new Error("Password Incorrect")
        }

        var token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )

        res.status(200).json({
            success: true,
            message: "login successful",
            token: token,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

async function UpdateUser(req, res) {
    var id = req.params.id;
    var updatedData = req.body;
    await UserModel.findByIdAndUpdate(id, updatedData)
    res.status(200).json({ message: "Data is Updated" })
}

async function deleteUser(req, res) {
    var id = req.params.id;
    await UserModel.findByIdAndDelete(id)
    res.status(200).json({ message: "todo Deleted" })
}

module.exports = { registerUser, loginUser, UpdateUser, deleteUser }