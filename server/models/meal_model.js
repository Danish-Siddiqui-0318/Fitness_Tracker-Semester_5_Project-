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
        foodName: {
            type: String,
            required: true,
            trim: true
        },
        calories: {
            type: Number,
            required: true,
            min: 0
        },
        description: {
            type: String,
            trim: true,
            default: ""
        },
        time: {
            type: String,
            default: () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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