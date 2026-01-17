var MealModel = require('../models/meal_model')

async function getAllMealOfUser(req, res) {
    try {
        var userId = req.params.id
        var meals = await MealModel.find({ user_id: userId })
            .sort({ date: -1, time: -1 }) 

        if (!meals || meals.length === 0) {
            res.status(404).json({ message: "No Meal Found. Add a new Meal" })
            return
        }

        res.status(200).json(meals)
    } catch (error) {
        console.error("Error fetching meals:", error)
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

async function postMeal(req, res) {
    try {
        var { user_id, mealType, foodName, calories, description, time } = req.body;

        if (!user_id || !mealType || !foodName || !calories) {
            res.status(400).json({ message: "User ID, meal type, food name, and calories are required" })
            return
        }

        const validMealTypes = ["Breakfast", "Lunch", "Dinner", "Snacks"]
        if (!validMealTypes.includes(mealType)) {
            res.status(400).json({ message: "Invalid meal type. Must be Breakfast, Lunch, Dinner, or Snacks" })
            return
        }

        if (isNaN(calories) || calories < 0) {
            res.status(400).json({ message: "Calories must be a positive number" })
            return
        }

        var newMeal = await MealModel.create({
            user_id,
            mealType,
            foodName,
            calories: Number(calories),
            description: description || "",
            time: time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })

        res.status(201).json({
            message: "Meal Added Successfully",
            meal: newMeal
        })
    } catch (error) {
        console.error("Error creating meal:", error)
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

async function DeleteMeal(req, res) {
    try {
        var id = req.params.id;
        var deletedMeal = await MealModel.findByIdAndDelete(id)

        if (!deletedMeal) {
            res.status(404).json({ message: "Meal not found" })
            return
        }

        res.status(200).json({
            message: "Meal Deleted Successfully",
            deletedMeal: deletedMeal
        })
    } catch (error) {
        console.error("Error deleting meal:", error)
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

module.exports = { getAllMealOfUser, postMeal, DeleteMeal }