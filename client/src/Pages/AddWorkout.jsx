import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    PlusCircle,
    Dumbbell,
    Hash,
    Repeat,
    Scale,
    ChevronRight,
    TrendingUp,
    Target,
    Zap,
    BarChart3,
    Save
} from 'lucide-react';
import Swal from 'sweetalert2';
import Navbar from '../Components/Navbar'
import { useNavigate } from 'react-router-dom';

const ExerciseForm = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        sets: '',
        reps: '',
        weight: ''
    });

    // Suggested exercises for quick selection
    const suggestedExercises = [
        { name: 'Bench Press', icon: '💪' },
        { name: 'Squats', icon: '🦵' },
        { name: 'Deadlifts', icon: '🏋️' },
        { name: 'Pull-ups', icon: '🤸' },
        { name: 'Shoulder Press', icon: '👆' },
        { name: 'Bicep Curls', icon: '💪' },
        { name: 'Leg Press', icon: '🦵' },
        { name: 'Chest Fly', icon: '🕊️' }
    ];

    // ================= FETCH PROFILE =================
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

    // ================= HANDLE INPUT =================
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Quick select exercise
    const selectExercise = (exerciseName) => {
        setFormData(prev => ({
            ...prev,
            name: exerciseName
        }));
    };

    // Calculate workout volume
    const calculateVolume = () => {
        const sets = parseInt(formData.sets) || 0;
        const reps = parseInt(formData.reps) || 0;
        const weight = parseInt(formData.weight) || 0;
        return sets * reps * weight;
    };

    // Get workout intensity based on volume
    const getIntensity = () => {
        const volume = calculateVolume();
        if (volume > 2000) return { level: "Very High", color: "from-red-500 to-orange-500" };
        if (volume > 1000) return { level: "High", color: "from-orange-500 to-yellow-500" };
        if (volume > 500) return { level: "Medium", color: "from-yellow-500 to-emerald-500" };
        if (volume > 0) return { level: "Light", color: "from-emerald-500 to-cyan-500" };
        return { level: "Not Set", color: "from-gray-500 to-gray-600" };
    };

    // ================= HANDLE SUBMIT =================
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!profile || !profile._id) return;

        setIsSubmitting(true);

        const payload = {
            user_id: profile._id,
            exerciseName: formData.name,
            sets: formData.sets,
            reps: formData.reps,
            weight: formData.weight
        };

        try {
            const response = await axios.post(
                "http://localhost:3000/workout/",
                payload
            );

            Swal.fire({
                title: "Workout Added!",
                text: "Your exercise has been logged successfully!",
                icon: "success",
                background: '#0a1a1a',
                color: '#ffffff',
                confirmButtonColor: '#183D3D',
            }).then(() => {
                setFormData({
                    name: '',
                    sets: '',
                    reps: '',
                    weight: ''
                });
                navigate("/workout");
            });

        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.response?.data?.message || "Failed to save workout",
                icon: "error",
                background: '#0a1a1a',
                color: '#ffffff',
                confirmButtonColor: '#183D3D',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // ================= LOAD PROFILE ONCE =================
    useEffect(() => {
        fetchProfile();
    }, []);

    const workoutVolume = calculateVolume();
    const intensity = getIntensity();

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-b from-[#040D12] to-[#0a1a1a] pt-20">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-cyan-900/10 to-teal-900/5 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-900/5 to-[#183D3D]/10 rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-6xl mx-auto px-4 py-8">
                    {/* Header Section */}
                    <div className="mb-12 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#183D3D] to-cyan-900 mb-6">
                            <PlusCircle className="w-10 h-10 text-cyan-300" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 via-emerald-200 to-teal-300 bg-clip-text text-transparent mb-3">
                            Log New Workout
                        </h1>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Track your exercise details and monitor your progress over time
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Form Section */}
                        <div className="lg:col-span-2">
                            <div className="bg-gray-900/70 backdrop-blur-xl rounded-3xl p-8 border border-gray-800/50 shadow-2xl">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-bold text-white flex items-center">
                                        <Dumbbell className="mr-3 text-cyan-400" />
                                        Exercise Details
                                    </h2>
                                    <div className="text-sm text-gray-400">
                                        Step 1 of 1
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Exercise Name with Suggestions */}
                                    <div>
                                        <label className="block text-sm font-medium mb-3 text-gray-300">
                                            Exercise Name
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-sm group-hover:blur transition-all duration-300"></div>
                                            <div className="relative">
                                                <input
                                                    required
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="w-full bg-gray-900/50 border border-gray-700/50 pl-12 pr-4 py-4 rounded-xl outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 text-white placeholder:text-gray-500"
                                                    placeholder="e.g., Bench Press, Squats, etc."
                                                />
                                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                                    <Dumbbell className="w-5 h-5 text-cyan-400" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quick Exercise Suggestions */}
                                        <div className="mt-4">
                                            <p className="text-sm text-gray-400 mb-3">Quick select:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {suggestedExercises.map((exercise, index) => (
                                                    <button
                                                        key={index}
                                                        type="button"
                                                        onClick={() => selectExercise(exercise.name)}
                                                        className={`flex items-center px-4 py-2 rounded-lg border transition-all duration-200 ${formData.name === exercise.name
                                                            ? 'bg-gradient-to-r from-cyan-900/30 to-cyan-900/10 border-cyan-500/50 text-cyan-300'
                                                            : 'bg-gray-800/30 border-gray-700/50 text-gray-400 hover:border-cyan-500/30 hover:text-cyan-300'
                                                            }`}
                                                    >
                                                        <span className="mr-2">{exercise.icon}</span>
                                                        {exercise.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Exercise Metrics Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Sets */}
                                        <div>
                                            <label className="block text-sm font-medium mb-3 text-gray-300">
                                                Sets
                                            </label>
                                            <div className="relative group">
                                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-xl blur-sm group-hover:blur transition-all duration-300"></div>
                                                <div className="relative">
                                                    <input
                                                        required
                                                        type="number"
                                                        min="1"
                                                        name="sets"
                                                        value={formData.sets}
                                                        onChange={handleChange}
                                                        className="w-full bg-gray-900/50 border border-gray-700/50 pl-12 pr-4 py-4 rounded-xl outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 text-white placeholder:text-gray-500"
                                                        placeholder="Number of sets"
                                                    />
                                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                                        <Hash className="w-5 h-5 text-emerald-400" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Reps */}
                                        <div>
                                            <label className="block text-sm font-medium mb-3 text-gray-300">
                                                Reps per Set
                                            </label>
                                            <div className="relative group">
                                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl blur-sm group-hover:blur transition-all duration-300"></div>
                                                <div className="relative">
                                                    <input
                                                        required
                                                        type="number"
                                                        min="1"
                                                        name="reps"
                                                        value={formData.reps}
                                                        onChange={handleChange}
                                                        className="w-full bg-gray-900/50 border border-gray-700/50 pl-12 pr-4 py-4 rounded-xl outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 text-white placeholder:text-gray-500"
                                                        placeholder="Repetitions"
                                                    />
                                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                                        <Repeat className="w-5 h-5 text-orange-400" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Weight */}
                                        <div>
                                            <label className="block text-sm font-medium mb-3 text-gray-300">
                                                Weight (kg)
                                            </label>
                                            <div className="relative group">
                                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-sm group-hover:blur transition-all duration-300"></div>
                                                <div className="relative">
                                                    <input
                                                        required
                                                        type="number"
                                                        min="0"
                                                        step="0.5"
                                                        name="weight"
                                                        value={formData.weight}
                                                        onChange={handleChange}
                                                        className="w-full bg-gray-900/50 border border-gray-700/50 pl-12 pr-4 py-4 rounded-xl outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 text-white placeholder:text-gray-500"
                                                        placeholder="Weight in kg"
                                                    />
                                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                                        <Scale className="w-5 h-5 text-purple-400" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Workout Summary Card */}
                                    {(formData.sets || formData.reps || formData.weight) && (
                                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                                <BarChart3 className="mr-2 text-cyan-400" />
                                                Workout Summary
                                            </h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div className="text-center p-4 bg-gray-900/50 rounded-lg">
                                                    <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                                        {formData.sets || 0}
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-1">Total Sets</div>
                                                </div>
                                                <div className="text-center p-4 bg-gray-900/50 rounded-lg">
                                                    <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                                                        {formData.reps || 0}
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-1">Reps per Set</div>
                                                </div>
                                                <div className="text-center p-4 bg-gray-900/50 rounded-lg">
                                                    <div className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                                                        {formData.weight || 0}
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-1">Weight (kg)</div>
                                                </div>
                                                <div className="text-center p-4 bg-gray-900/50 rounded-lg">
                                                    <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                                        {workoutVolume}
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-1">Total Volume</div>
                                                </div>
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-gray-700/50">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-400">Workout Intensity:</span>
                                                    <span className={`font-semibold bg-gradient-to-r ${intensity.color} bg-clip-text text-transparent`}>
                                                        {intensity.level}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <div className="pt-6">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`w-full py-4 px-6 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 flex items-center justify-center group ${isSubmitting
                                                    ? 'bg-gradient-to-r from-gray-700 to-gray-800 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-[#183D3D] to-cyan-900 hover:from-cyan-900 hover:to-[#183D3D] hover:shadow-2xl hover:scale-[1.02]'
                                                }`}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                                                    Saving Workout...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-5 h-5 mr-2" />
                                                    <span>Save Workout</span>
                                                    <ChevronRight className="w-5 h-5 ml-3 transform group-hover:translate-x-1 transition-transform duration-300" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Sidebar with Tips and Stats */}
                        <div className="space-y-6">
                            {/* Workout Tips */}
                            <div className="bg-gray-900/70 backdrop-blur-xl rounded-3xl p-6 border border-gray-800/50 shadow-2xl">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                    <Zap className="mr-2 text-yellow-400" />
                                    Pro Tips
                                </h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-900/30 to-cyan-900/10 flex items-center justify-center mr-3 mt-0.5">
                                            <span className="text-xs text-cyan-300">1</span>
                                        </div>
                                        <p className="text-sm text-gray-400">
                                            Maintain proper form to prevent injuries
                                        </p>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-900/30 to-emerald-900/10 flex items-center justify-center mr-3 mt-0.5">
                                            <span className="text-xs text-emerald-300">2</span>
                                        </div>
                                        <p className="text-sm text-gray-400">
                                            Rest 60-90 seconds between sets
                                        </p>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-900/30 to-orange-900/10 flex items-center justify-center mr-3 mt-0.5">
                                            <span className="text-xs text-orange-300">3</span>
                                        </div>
                                        <p className="text-sm text-gray-400">
                                            Progressive overload is key for growth
                                        </p>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-900/30 to-purple-900/10 flex items-center justify-center mr-3 mt-0.5">
                                            <span className="text-xs text-purple-300">4</span>
                                        </div>
                                        <p className="text-sm text-gray-400">
                                            Track consistently to see long-term progress
                                        </p>
                                    </li>
                                </ul>
                            </div>

                            {/* Recent Activity Preview */}
                            <div className="bg-gray-900/70 backdrop-blur-xl rounded-3xl p-6 border border-gray-800/50 shadow-2xl">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                    <TrendingUp className="mr-2 text-green-400" />
                                    Benefits of Tracking
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center p-3 rounded-lg bg-gray-800/30">
                                        <Target className="w-4 h-4 text-cyan-400 mr-3" />
                                        <span className="text-sm text-gray-300">Better goal setting</span>
                                    </div>
                                    <div className="flex items-center p-3 rounded-lg bg-gray-800/30">
                                        <BarChart3 className="w-4 h-4 text-emerald-400 mr-3" />
                                        <span className="text-sm text-gray-300">Progress visualization</span>
                                    </div>
                                    <div className="flex items-center p-3 rounded-lg bg-gray-800/30">
                                        <Zap className="w-4 h-4 text-orange-400 mr-3" />
                                        <span className="text-sm text-gray-300">Increased motivation</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-gray-900/70 backdrop-blur-xl rounded-3xl p-6 border border-gray-800/50 shadow-2xl">
                                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                                <button
                                    onClick={() => navigate("/workout")}
                                    className="w-full py-3 px-4 rounded-xl border border-gray-700/50 hover:border-cyan-500/50 hover:bg-gray-800/50 transition-all duration-300 text-gray-300 hover:text-white flex items-center justify-between mb-3"
                                >
                                    <span>View All Workouts</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => {
                                        setFormData({
                                            name: '',
                                            sets: '',
                                            reps: '',
                                            weight: ''
                                        });
                                    }}
                                    className="w-full py-3 px-4 rounded-xl border border-gray-700/50 hover:border-red-500/50 hover:bg-gray-800/50 transition-all duration-300 text-gray-300 hover:text-white flex items-center justify-between"
                                >
                                    <span>Clear Form</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ExerciseForm;