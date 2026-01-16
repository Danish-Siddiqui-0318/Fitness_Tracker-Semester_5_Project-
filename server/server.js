// Imports

var express = require('express')
var app = express()
var cors = require('cors')
require('dotenv').config()
require('./config/db.js')
// var connectDB = require('./config/db')
var authRoute = require('./routes/auth_routes')
var WorkoutRoute = require('./routes/workout_routes')
var MealRoute = require('./routes/meal_route')
var WeightRoute = require("./routes/weight_routes.js")
var feedBackRoute = require("./routes/feedback_routes.js")
//Middle Ware Calls

app.use(express.json())
app.use(cors())
app.use("/auth", authRoute)
app.use("/workout", WorkoutRoute)
app.use("/meal", MealRoute)
app.use("/weight", WeightRoute)
app.use("/feedback", feedBackRoute)
app.use(require('./middleware/error_handler'))


// Server Run
app.listen(process.env.PORT, () => {
    console.log("Server is Running")
})