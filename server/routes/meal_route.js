var express = require('express')
var route = express.Router()
var mealController = require('../controllers/meal_controller')

route.route("/").get(mealController.getAllMealOfUser).post(mealController.postMeal)
route.route("/:id").delete(mealController.DeleteMeal)

module.exports = route