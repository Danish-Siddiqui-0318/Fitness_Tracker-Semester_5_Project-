var express = require('express')
var router = express.Router()
var mealController = require('../controllers/meal_controller')

router.route("/").get(mealController.getAllMealOfUser).post(mealController.postMeal)
router.route("/:id").delete(mealController.DeleteMeal)

module.exports = router