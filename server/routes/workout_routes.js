var express = require('express')
var router = express.Router()
var workoutController = require('../controllers/workout_controller')

router.route("/").get(workoutController.getAllWorkoutOfUser).post(workoutController.postWorkOut)
router.route("/:id").put(workoutController.UpdateWorkout).delete(workoutController.DeleteWorkout)

module.exports = router