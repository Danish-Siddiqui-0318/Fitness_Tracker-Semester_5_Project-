const jwt = require("jsonwebtoken")
const UserModel = require("../models/UserModel")

async function jwtMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Not authorized, no token" })
        }

        const token = authHeader.split(" ")[1]

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = await UserModel.findById(decoded.id).select("-password")

        next()
    } catch (error) {
        return res.status(401).json({ message: "Token invalid or expired" })
    }
}

module.exports = jwtMiddleware
