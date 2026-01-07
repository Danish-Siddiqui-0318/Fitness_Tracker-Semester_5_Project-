const mongoose = require("mongoose")

var weightSchema = mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true
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
var weightModel = mongoose.model("Weight", weightSchema)

module.exports = weightModel
