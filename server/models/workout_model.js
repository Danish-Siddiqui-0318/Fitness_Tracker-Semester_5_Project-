var mongoose = require('mongoose')

var workoutSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true,
        },
        exerciseName: {
            type: String,
            required: true,
            trim: true,
        },
        sets: {
            type: Number,
            required: true,
            min: 1
        },
        reps: {
            type: Number,
            required: true,
            min: 1
        },
        weight: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        timestamps: true
    }
)

var WorkOutModel = mongoose.model("Workout", workoutSchema)

module.exports = WorkOutModel