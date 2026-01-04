var WorkOutModel = require('../models/workout_model')

async function getAllWorkoutOfUser(req, res) {
    var userId = req.params.id
    var workouts = await WorkOutModel.find({ user_id: userId })
    if (!workouts || workouts.length === 0) {
        res.status(404).json({ message: "No workout exist yet" });
        throw new Error("No workout found. Add a Workout")
    }

    res.status(200).json(workouts)
}


async function getSingleWorkout(req, res) {
    try {
        const workoutId = req.params.id

        const workout = await WorkOutModel.findById(workoutId)

        if (!workout) {
            return res.status(404).json({ message: "Workout not found" })
        }

        res.status(200).json(workout)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

async function postWorkOut(req, res) {
    var { user_id, exerciseName, sets, reps, weight } = req.body;
    if (!user_id || !exerciseName || !sets || !reps || !weight) {
        res.status(400)
        throw new Error("All fields are required")
    }

    var newWorkout = await WorkOutModel.create({
        user_id,
        exerciseName,
        sets,
        reps,
        weight
    });

    res.status(201).json({
        message: "Workout Added Successfully",
        workout: newWorkout
    })
}

async function UpdateWorkout(req, res) {
    var id = req.params.id;
    var updatedData = req.body
    await WorkOutModel.findByIdAndUpdate(id, updatedData)
    res.status(200).json({ message: "Workout Updated" })
}

async function DeleteWorkout(req, res) {
    var id = req.params.id;
    await WorkOutModel.findByIdAndDelete(id)
    res.status(200).json({ message: "Workout Deleted" })
}

module.exports = { getAllWorkoutOfUser, postWorkOut, UpdateWorkout, DeleteWorkout, getSingleWorkout }