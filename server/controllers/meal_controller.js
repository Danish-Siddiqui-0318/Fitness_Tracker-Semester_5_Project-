var MealModel = require('../models/meal_model')

async function getAllMealOfUser(req, res) {
    var userId = req.params.id
    var meals = await MealModel.find({ user_id: userId })
    if (!meals || meals.length === 0) {
        res.status(404);
        throw new Error("No Meal Found. Add a new Meal")
    }

    res.status(200).json(meals)
}

async function postMeal(req, res) {
    var { user_id, mealType, calories, date } = req.body;
    if (!user_id || !mealType || !calories || !date) {
        res.status(400)
        throw new Error("All fields are required")
    }

    var newMeal = await MealModel.create(
        {
            user_id,
            mealType,
            calories,
            date
        }
    )

    res.status(201).json({
        message: "Meal Added Successfully",
        meal: newMeal
    })


}

async function DeleteMeal(req, res) {
    var id = req.params.id;
    await MealModel.findByIdAndDelete(id)
    res.status(200).json({ message: "Meal Deleted" })
}




module.exports = { getAllMealOfUser, postMeal, DeleteMeal }