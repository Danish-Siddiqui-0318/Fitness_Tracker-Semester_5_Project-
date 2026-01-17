var UserModel = require('../models/user_model')
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')
var WeightModel=require("../models/weight_model")

// register acoount 
async function registerUser(req, res) {
    const { name, email, password, weight } = req.body;

    if (!name || !email || !password || !weight) {
        res.status(400);
        throw new Error("Please provide all fields including weight");
    }

    const userExist = await UserModel.findOne({ email });
    if (userExist) {
        res.status(400);
        throw new Error("This email is already registered");
    }

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const userData = await UserModel.create({
        name,
        email,
        password: encryptedPassword
    });

    await WeightModel.create({
        user_id: userData._id,
        weight: weight
    });

    res.status(201).json({
        success: true,
        message: "Account created successfully",
        data: userData
    });
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

            {
                _id: user._id,
                name: user.name,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )

        res.status(200).json({
            success: true,
            message: "login successful",
            token: token,
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

async function getUserProfile(req, res) {
    if (!req.user) {
        res.status(401);
        throw new Error("User not authorized");
    }

    res.status(200).json(req.user);
};


module.exports = { registerUser, loginUser, UpdateUser, deleteUser, getUserProfile }