const mongoose = require('mongoose')

var mealSchema = mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true
        },
        mealType: {
            type: String,
            required: true,
            enum: ["Breakfast", "Lunch", "Dinner", "Snacks"]
        },
        calories: {
            type: Number,
            required: true,
            min: 0
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
)

var mealModel = mongoose.model("Meals", mealSchema)

module.exports = mealModel  