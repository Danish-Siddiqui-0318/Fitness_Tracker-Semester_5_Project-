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