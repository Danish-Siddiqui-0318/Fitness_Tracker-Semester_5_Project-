// Imports

var express = require('express')
var app = express()
var cors = require('cors')
var env = require('dotenv').config()
var connectDB = require('./config/db')
var authRoute = require('./routes/auth_routes')
var WorkoutRoute = require('./routes/workout_routes')
var MealRoute = require('./routes/meal_route')
//Middle Ware Calls

app.use(express.json())
connectDB()
app.use(cors())
app.use("/auth", authRoute)
app.use("/workout", WorkoutRoute)
app.use("/meal", MealRoute)
app.use(require('./middleware/error_handler'))


// Server Run
app.listen(process.env.PORT, () => {
    console.log("Server is Running")
})