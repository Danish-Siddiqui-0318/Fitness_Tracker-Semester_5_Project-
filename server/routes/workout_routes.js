var express = require('express')
var router = express.Router()
var workoutController = require('../controllers/workout_controller')

router.route("/").post(workoutController.postWorkOut)
router.route("/single/:id").get(workoutController.getSingleWorkout)
router.route("/:id").put(workoutController.UpdateWorkout).delete(workoutController.DeleteWorkout).get(workoutController.getAllWorkoutOfUser)

module.exports = router