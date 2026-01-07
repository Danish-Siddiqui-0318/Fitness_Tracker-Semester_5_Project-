import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function AddCalories() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        mealType: "",
        calories: "",
        foodName: "",
        description: "",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    const [mealSuggestions, setMealSuggestions] = useState([
        { name: "Oatmeal", calories: 150, icon: "🥣" },
        { name: "Chicken Salad", calories: 320, icon: "🥗" },
        { name: "Protein Shake", calories: 180, icon: "🥤" },
        { name: "Apple", calories: 95, icon: "🍎" },
        { name: "Grilled Salmon", calories: 420, icon: "🐟" },
        { name: "Greek Yogurt", calories: 130, icon: "🥛" }
    ]);
    const navigate = useNavigate();

    async function fetchProfile() {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                "http://localhost:3000/auth/profile",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setProfile(response.data);
        } catch (error) {
            console.error(
                "Failed to fetch profile",
                error.response?.data || error.message
            );
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleMealSuggestion = (suggestion) => {
        setFormData(prev => ({
            ...prev,
            foodName: suggestion.name,
            calories: suggestion.calories
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!profile || !profile._id) return;

        setLoading(true);

        const payload = {
            user_id: profile._id,
            mealType: formData.mealType,
            foodName: formData.foodName || formData.mealType, // Add foodName
            calories: Number(formData.calories),
            description: formData.description, // Add description
            time: formData.time // Add time
        };

        try {
            const response = await axios.post("http://localhost:3000/meal/", payload);
            await Swal.fire({
                title: "🎉 Meal Added!",
                text: response.data.message,
                icon: "success",
                background: "#1f2937",
                color: "#fff",
                confirmButtonColor: "#0891b2",
                timer: 2000
            });
            navigate("/calories");
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: error.response?.data?.message || "Failed to add meal",
                icon: "error",
                background: "#1f2937",
                color: "#fff",
                confirmButtonColor: "#dc2626"
            });
        } finally {
            setLoading(false);
        }
    };

    const calculateProgress = () => {
        const calorieIntake = Number(formData.calories) || 0;
        const dailyGoal = 2000; // Example daily calorie goal
        return Math.min(Math.round((calorieIntake / dailyGoal) * 100), 100);
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#040D12] to-[#0a1a1a] py-8 px-4 flex items-center justify-center">
            <div className="w-full max-w-4xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                        Add Your Meal
                    </h1>
                    <p className="text-gray-400 mt-2">Track your nutrition and stay on top of your health goals</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Panel - Form */}
                    <div className="lg:col-span-2">
                        <form
                            onSubmit={handleSubmit}
                            className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-800 space-y-6"
                        >
                            {/* Meal Type with Icons */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-3">
                                    <span className="flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path>
                                        </svg>
                                        Meal Type
                                    </span>
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {["Breakfast", "Lunch", "Dinner", "Snacks"].map((type) => (
                                        <button
                                            type="button"
                                            key={type}
                                            onClick={() => setFormData(prev => ({ ...prev, mealType: type }))}
                                            className={`py-3 rounded-xl transition-all duration-300 ${formData.mealType === type
                                                ? 'bg-gradient-to-r from-cyan-900 to-teal-900 border border-cyan-500'
                                                : 'bg-gray-800 hover:bg-gray-750 border border-gray-700'
                                                }`}
                                        >
                                            <div className="flex flex-col items-center">
                                                <span className="text-2xl mb-1">
                                                    {type === "Breakfast" && "🍳"}
                                                    {type === "Lunch" && "🥪"}
                                                    {type === "Dinner" && "🍽️"}
                                                    {type === "Snacks" && "🍎"}
                                                </span>
                                                <span className="text-sm font-medium">{type}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Food Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        Food Name
                                    </label>
                                    <input
                                        type="text"
                                        name="foodName"
                                        value={formData.foodName}
                                        onChange={handleChange}
                                        placeholder="e.g., Chicken Salad"
                                        className="w-full rounded-xl bg-gray-800 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                                    />
                                </div>

                                {/* Calories */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        <span className="flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                            </svg>
                                            Calories
                                        </span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="calories"
                                            value={formData.calories}
                                            onChange={handleChange}
                                            min="0"
                                            required
                                            placeholder="Enter calories"
                                            className="w-full rounded-xl bg-gray-800 border border-gray-700 text-white px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                                        />
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-400 font-bold">
                                            🔥
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    Description (Optional)
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Add any notes about your meal..."
                                    rows="3"
                                    className="w-full rounded-xl bg-gray-800 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition resize-none"
                                />
                            </div>

                            {/* Time */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    <span className="flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        Time
                                    </span>
                                </label>
                                <input
                                    type="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    className="w-full rounded-xl bg-gray-800 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading || !formData.mealType || !formData.calories}
                                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] ${loading || !formData.mealType || !formData.calories
                                    ? 'bg-gray-700 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 shadow-lg hover:shadow-cyan-500/25'
                                    }`}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                                        Adding Meal...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center">
                                        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                        </svg>
                                        Save Meal
                                    </div>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Right Panel - Preview & Suggestions */}
                    <div className="space-y-6">
                        {/* Meal Preview */}
                        <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                                Meal Preview
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Meal Type:</span>
                                    <span className="font-semibold text-white">
                                        {formData.mealType || "Not selected"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Food:</span>
                                    <span className="font-semibold text-white">
                                        {formData.foodName || "Not specified"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Calories:</span>
                                    <span className="font-bold text-amber-400">
                                        {formData.calories || "0"} kcal
                                    </span>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            {formData.calories && (
                                <div className="mt-6">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-400">Daily Progress</span>
                                        <span className="text-cyan-400">{calculateProgress()}%</span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded-full h-3">
                                        <div
                                            className="bg-gradient-to-r from-cyan-500 to-teal-500 h-3 rounded-full transition-all duration-500"
                                            style={{ width: `${calculateProgress()}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        {formData.calories} of 2000 daily calories
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Quick Suggestions */}
                        <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                </svg>
                                Quick Suggestions
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {mealSuggestions.map((meal, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => handleMealSuggestion(meal)}
                                        className="group p-3 rounded-lg bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-cyan-500/30 transition-all duration-300"
                                    >
                                        <div className="flex items-center">
                                            <span className="text-2xl mr-3">{meal.icon}</span>
                                            <div className="text-left">
                                                <p className="text-sm font-medium text-white group-hover:text-cyan-300">
                                                    {meal.name}
                                                </p>
                                                <p className="text-xs text-amber-400">
                                                    {meal.calories} kcal
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Daily Stats */}
                        <div className="bg-gradient-to-br from-gray-900 to-cyan-900/20 rounded-2xl p-6 border border-cyan-900/30">
                            <h3 className="text-lg font-bold text-white mb-4">📊 Daily Stats</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Target Calories:</span>
                                    <span className="font-bold text-white">2000 kcal</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Remaining:</span>
                                    <span className="font-bold text-emerald-400">
                                        {2000 - (Number(formData.calories) || 0)} kcal
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Meals Today:</span>
                                    <span className="font-bold text-white">3</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddCalories;