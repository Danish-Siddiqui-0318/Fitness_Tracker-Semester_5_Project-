const mongoose = require('mongoose')

var feedbackSchema = mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true
        },
        feedback: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true
    }
)

var feedbackModel = mongoose.model("feedback", feedbackSchema)

module.exports = feedbackModel