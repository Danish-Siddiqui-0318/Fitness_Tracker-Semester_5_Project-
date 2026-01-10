var weightModel = require('../models/weight_model')

async function getUserWeight(req, res) {
    var userId = req.params.id
    var weight = await weightModel.find({ user_id: userId })
    if (!weight || weight.length === 0) {
        res.status(404).json({ message: "No weight exist yet" });
        throw new Error("No weight found. Add a Workout")
    }

    res.status(200).json(weight)
}

async function PostWeight(req, res) {
    var { user_id, weight } = req.body;
    if (!user_id || !weight) {
        res.status(400)
        throw new Error("All fields are required")
    }
    var weight = await weightModel.create({
        user_id,
        weight
    })
    res.status(201).json({
        message: "Weight Added Successfully",
        weight
    })
}
module.exports = { getUserWeight, PostWeight }