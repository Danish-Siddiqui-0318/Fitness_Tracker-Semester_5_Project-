var express = require('express')
var router = express.Router()
var mealController = require('../controllers/meal_controller')

router.route("/").post(mealController.postMeal)
router.route("/:id").delete(mealController.DeleteMeal).get(mealController.getAllMealOfUser)

module.exports = router