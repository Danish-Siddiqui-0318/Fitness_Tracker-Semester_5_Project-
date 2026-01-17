import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from "../Components/Navbar";

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
        { name: "Oatmeal", calories: 150, icon: "🥣", color: "from-amber-500 to-orange-500" },
        { name: "Chicken Salad", calories: 320, icon: "🥗", color: "from-emerald-500 to-green-500" },
        { name: "Protein Shake", calories: 180, icon: "🥤", color: "from-blue-500 to-cyan-500" },
        { name: "Apple", calories: 95, icon: "🍎", color: "from-red-500 to-pink-500" },
        { name: "Grilled Salmon", calories: 420, icon: "🐟", color: "from-purple-500 to-indigo-500" },
        { name: "Greek Yogurt", calories: 130, icon: "🥛", color: "from-gray-500 to-blue-200" }
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
            foodName: formData.foodName || formData.mealType,
            calories: Number(formData.calories),
            description: formData.description,
            time: formData.time
        };

        try {
            const response = await axios.post("http://localhost:3000/meal/", payload);
            await Swal.fire({
                title: "🎉 Meal Added Successfully!",
                text: response.data.message,
                icon: "success",
                background: "#0f172a",
                color: "#fff",
                confirmButtonColor: "#0ea5e9",
                timer: 2000,
                showConfirmButton: false,
                customClass: {
                    popup: 'border border-cyan-500/20 shadow-2xl shadow-cyan-500/10'
                }
            });
            navigate("/calories");
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: error.response?.data?.message || "Failed to add meal",
                icon: "error",
                background: "#0f172a",
                color: "#fff",
                confirmButtonColor: "#ef4444",
                customClass: {
                    popup: 'border border-red-500/20 shadow-2xl shadow-red-500/10'
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const calculateProgress = () => {
        const calorieIntake = Number(formData.calories) || 0;
        const dailyGoal = 2000;
        return Math.min(Math.round((calorieIntake / dailyGoal) * 100), 100);
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#040D12] via-[#0a1a1a] to-[#0f2936] text-white overflow-hidden relative">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-900/10 to-teal-900/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-900/10 to-[#0f2936]/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-purple-900/5 to-pink-900/5 rounded-full blur-3xl"></div>
            </div>

            <div className="absolute inset-0">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-gradient-to-r from-cyan-400/30 to-emerald-400/30 rounded-full animate-float"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`
                        }}
                    ></div>
                ))}
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    50% { transform: translateY(-15px) translateX(10px); }
                }
                .animate-float {
                    animation: float infinite ease-in-out;
                }
                @keyframes pulse-glow {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                .animate-pulse-glow {
                    animation: pulse-glow 2s infinite;
                }
            `}</style>

            <Navbar />
            
            <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
                <div className="text-center mb-12 relative">
                    <div className="inline-block relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-teal-500/20 to-emerald-500/20 blur-2xl rounded-full"></div>
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-300 bg-clip-text text-transparent relative">
                            Add Your Meal
                        </h1>
                    </div>
                    <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
                        Track your nutrition with precision and stay on top of your health goals
                    </p>
                    <div className="flex justify-center items-center mt-6 space-x-4">
                        <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2 animate-pulse"></div>
                            <span className="text-sm text-gray-400">Live Tracking</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-gray-700"></div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-cyan-500 mr-2 animate-pulse"></div>
                            <span className="text-sm text-gray-400">Smart Suggestions</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 via-teal-500/10 to-emerald-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            <form
                                onSubmit={handleSubmit}
                                className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-800/50 shadow-2xl space-y-8"
                            >
                                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-full -translate-x-16 -translate-y-16"></div>
                                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-emerald-500/5 to-transparent rounded-full translate-x-16 translate-y-16"></div>

                                <div className="relative">
                                    <label className="block text-lg font-bold text-white mb-4 flex items-center">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center mr-3 shadow-lg">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path>
                                            </svg>
                                        </div>
                                        Select Meal Type
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {["Breakfast", "Lunch", "Dinner", "Snacks"].map((type, index) => {
                                            const icons = ["🌅", "☀️", "🌙", "🍎"];
                                            const colors = [
                                                "from-amber-500 to-orange-500",
                                                "from-emerald-500 to-green-500",
                                                "from-blue-500 to-indigo-500",
                                                "from-purple-500 to-pink-500"
                                            ];
                                            return (
                                                <button
                                                    type="button"
                                                    key={type}
                                                    onClick={() => setFormData(prev => ({ ...prev, mealType: type }))}
                                                    className={`relative overflow-hidden group/button p-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] ${
                                                        formData.mealType === type
                                                            ? `bg-gradient-to-br ${colors[index]} shadow-lg shadow-${colors[index].split(' ')[0].split('-')[1]}-500/25`
                                                            : 'bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm'
                                                    }`}
                                                >
                                                    <div className="relative z-10 flex flex-col items-center">
                                                        <span className="text-3xl mb-2 transform group-hover/button:scale-110 transition-transform duration-300">
                                                            {icons[index]}
                                                        </span>
                                                        <span className="font-semibold">{type}</span>
                                                        <span className="text-xs opacity-75 mt-1">
                                                            {type === "Breakfast" && "6-10 AM"}
                                                            {type === "Lunch" && "12-2 PM"}
                                                            {type === "Dinner" && "6-9 PM"}
                                                            {type === "Snacks" && "Anytime"}
                                                        </span>
                                                    </div>
                                                    {formData.mealType === type && (
                                                        <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative group">
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                                            <span className="flex items-center">
                                                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center mr-2">
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454"></path>
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z"></path>
                                                    </svg>
                                                </div>
                                                Food Name
                                            </span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <input
                                                type="text"
                                                name="foodName"
                                                value={formData.foodName}
                                                onChange={handleChange}
                                                placeholder="e.g., Grilled Chicken Salad"
                                                className="relative w-full rounded-xl bg-gray-800/50 border border-gray-700/50 text-white px-4 py-3.5 pl-12 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/30 transition-all duration-300 backdrop-blur-sm"
                                            />
                                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative group">
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                                            <span className="flex items-center">
                                                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center mr-2">
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                                    </svg>
                                                </div>
                                                Calories
                                            </span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <input
                                                type="number"
                                                name="calories"
                                                value={formData.calories}
                                                onChange={handleChange}
                                                min="0"
                                                required
                                                placeholder="Enter calories"
                                                className="relative w-full rounded-xl bg-gray-800/50 border border-gray-700/50 text-white px-4 py-3.5 pl-12 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/30 transition-all duration-300 backdrop-blur-sm"
                                            />
                                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center animate-pulse">
                                                    <span className="text-sm font-bold">🔥</span>
                                                </div>
                                            </div>
                                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                                <span className="text-amber-400 font-bold">kcal</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative group">
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        <span className="flex items-center">
                                            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mr-2">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                                                </svg>
                                            </div>
                                            Description
                                            <span className="text-xs text-gray-500 ml-2">(Optional)</span>
                                        </span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="Add notes about ingredients, portion size, or how you feel..."
                                            rows="3"
                                            className="relative w-full rounded-xl bg-gray-800/50 border border-gray-700/50 text-white px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/30 transition-all duration-300 backdrop-blur-sm resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="relative group">
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        <span className="flex items-center">
                                            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center mr-2">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                            </div>
                                            Time
                                        </span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <input
                                            type="time"
                                            name="time"
                                            value={formData.time}
                                            onChange={handleChange}
                                            className="relative w-full rounded-xl bg-gray-800/50 border border-gray-700/50 text-white px-4 py-3.5 pl-12 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all duration-300 backdrop-blur-sm"
                                        />
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        disabled={loading || !formData.mealType || !formData.calories}
                                        className={`relative w-full py-4 px-6 rounded-2xl font-bold text-lg text-white shadow-2xl transition-all duration-500 transform hover:scale-[1.02] group/btn ${
                                            loading || !formData.mealType || !formData.calories
                                                ? 'bg-gray-700 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-700 hover:via-teal-700 hover:to-emerald-700'
                                        }`}
                                    >
                                        <div className={`absolute -inset-1 bg-gradient-to-r from-cyan-500/30 via-teal-500/30 to-emerald-500/30 rounded-2xl blur-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 ${
                                            loading || !formData.mealType || !formData.calories ? 'hidden' : ''
                                        }`}></div>
                                        
                                        <div className="relative flex items-center justify-center">
                                            {loading ? (
                                                <>
                                                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                                                    Adding Your Meal...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-6 h-6 mr-3 transform group-hover/btn:rotate-90 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                                    </svg>
                                                    Save & Continue
                                                    <svg className="w-5 h-5 ml-3 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-2 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                                    </svg>
                                                </>
                                            )}
                                        </div>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-br from-cyan-500/10 to-teal-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-800/50 shadow-xl">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-white flex items-center">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center mr-3 shadow-lg">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                            </svg>
                                        </div>
                                        Meal Preview
                                    </h3>
                                    <div className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-cyan-900/30 to-teal-900/30 border border-cyan-500/20 text-cyan-300">
                                        Live Preview
                                    </div>
                                </div>
                                
                                <div className="space-y-5">
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-800/30">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center mr-3">
                                                <span className="text-lg">
                                                    {formData.mealType === "Breakfast" && "🍳"}
                                                    {formData.mealType === "Lunch" && "🥪"}
                                                    {formData.mealType === "Dinner" && "🍽️"}
                                                    {formData.mealType === "Snacks" && "🍎"}
                                                    {!formData.mealType && "📋"}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-400">Meal Type</p>
                                                <p className="font-semibold">{formData.mealType || "Not selected"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-800/30">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-700/30 to-teal-700/30 flex items-center justify-center mr-3">
                                                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-400">Food Item</p>
                                                <p className="font-semibold">{formData.foodName || "Not specified"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-800/30">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-700/30 to-orange-700/30 flex items-center justify-center mr-3 animate-pulse">
                                                <span className="text-lg">🔥</span>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-400">Calories</p>
                                                <p className="font-bold text-2xl text-amber-400">
                                                    {formData.calories || "0"} 
                                                    <span className="text-sm font-normal ml-1 text-amber-300">kcal</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {formData.calories && (
                                        <div className="mt-6">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-400">Daily Progress</span>
                                                <span className="font-bold text-cyan-300">{calculateProgress()}%</span>
                                            </div>
                                            <div className="relative h-3 bg-gray-800/50 rounded-full overflow-hidden">
                                                <div
                                                    className="absolute h-full bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 rounded-full transition-all duration-1000 animate-pulse-glow"
                                                    style={{ width: `${calculateProgress()}%` }}
                                                ></div>
                                                {/* Animated scanning line */}
                                                <div className="absolute h-full w-1 bg-white/30 rounded-full animate-scan" 
                                                     style={{ animation: 'scan 2s infinite linear' }}>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-2">
                                                {formData.calories} of 2000 daily calories ({2000 - (Number(formData.calories) || 0)} remaining)
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-800/50 shadow-xl">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-white flex items-center">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center mr-3 shadow-lg">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                            </svg>
                                        </div>
                                        Quick Suggestions
                                    </h3>
                                    <span className="text-xs text-gray-400">Click to select</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {mealSuggestions.map((meal, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => handleMealSuggestion(meal)}
                                            className="group relative overflow-hidden p-3 rounded-xl bg-gray-800/30 hover:bg-gray-700/50 border border-gray-700/50 hover:border-transparent transition-all duration-300 transform hover:scale-[1.03]"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <div className="relative flex items-center">
                                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${meal.color} flex items-center justify-center mr-3 transform group-hover:scale-110 transition-transform duration-300`}>
                                                    <span className="text-2xl">{meal.icon}</span>
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                                                        {meal.name}
                                                    </p>
                                                    <p className="text-sm text-amber-400 font-bold">
                                                        {meal.calories} kcal
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative bg-gradient-to-br from-gray-900/90 to-cyan-900/20 backdrop-blur-xl rounded-3xl p-6 border border-cyan-900/30 shadow-xl">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mr-3 shadow-lg">
                                        <span className="text-lg">📊</span>
                                    </div>
                                    Daily Stats
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { label: "Target Calories", value: "2000 kcal", color: "text-cyan-300" },
                                        { label: "Current Intake", value: `${formData.calories || 0} kcal`, color: "text-amber-400" },
                                        { label: "Remaining", value: `${2000 - (Number(formData.calories) || 0)} kcal`, color: "text-emerald-400" },
                                        { label: "Meals Today", value: "3", color: "text-white" }
                                    ].map((stat, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gray-800/20 to-transparent hover:from-gray-800/40 transition-all duration-300">
                                            <span className="text-gray-400">{stat.label}</span>
                                            <span className={`font-bold ${stat.color}`}>{stat.value}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 pt-4 border-t border-cyan-900/30">
                                    <p className="text-xs text-center text-gray-400">
                                        Based on a 2000 kcal daily goal
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes scan {
                    0% { left: -10%; }
                    100% { left: 110%; }
                }
                .animate-scan {
                    animation: scan 2s infinite linear;
                }
            `}</style>
        </div>
    );
}

export default AddCalories;