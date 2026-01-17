import React, { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import {
    ArrowLeft,
    Save,
    Dumbbell,
    Hash,
    Repeat,
    Scale,
    Info,
    TrendingUp,
    BarChart3,
    RotateCcw,
    CheckCircle
} from "lucide-react"
import Navbar from "../Components/Navbar"
import Swal from "sweetalert2"

const UpdateWorkoutPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [originalData, setOriginalData] = useState(null)

    const [formData, setFormData] = useState({
        exerciseName: "",
        sets: "",
        reps: "",
        weight: "",
    })

    const calculateVolume = () => {
        const sets = parseInt(formData.sets) || 0
        const reps = parseInt(formData.reps) || 0
        const weight = parseInt(formData.weight) || 0
        return sets * reps * weight
    }

    const hasChanges = () => {
        if (!originalData) return false
        return (
            formData.exerciseName !== originalData.exerciseName ||
            formData.sets !== originalData.sets ||
            formData.reps !== originalData.reps ||
            formData.weight !== originalData.weight
        )
    }

    useEffect(() => {
        async function fetchWorkout() {
            try {
                const res = await axios.get(
                    `http://localhost:3000/workout/single/${id}`
                )

                const workoutData = {
                    exerciseName: res.data.exerciseName,
                    sets: res.data.sets,
                    reps: res.data.reps,
                    weight: res.data.weight,
                }

                setFormData(workoutData)
                setOriginalData(workoutData)
            } catch (error) {
                console.error("Failed to fetch workout", error)
                Swal.fire({
                    title: "Error",
                    text: "Failed to load workout data",
                    icon: "error",
                    background: '#0a1a1a',
                    color: '#ffffff',
                    confirmButtonColor: '#183D3D',
                })
            } finally {
                setLoading(false)
            }
        }

        fetchWorkout()
    }, [id])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleReset = () => {
        if (originalData) {
            setFormData(originalData)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!hasChanges()) {
            Swal.fire({
                title: "No Changes",
                text: "You haven't made any changes to save",
                icon: "info",
                background: '#0a1a1a',
                color: '#ffffff',
                confirmButtonColor: '#183D3D',
            })
            return
        }

        setIsSubmitting(true)
        try {
            await axios.put(
                `http://localhost:3000/workout/${id}`,
                formData
            )

            Swal.fire({
                title: "Workout Updated!",
                text: "Your workout has been updated successfully",
                icon: "success",
                background: '#0a1a1a',
                color: '#ffffff',
                confirmButtonColor: '#183D3D',
            }).then(() => {
                navigate("/workout")
            })

        } catch (error) {
            console.error("Failed to update workout", error)
            Swal.fire({
                title: "Update Failed",
                text: error.response?.data?.message || "Failed to update workout",
                icon: "error",
                background: '#0a1a1a',
                color: '#ffffff',
                confirmButtonColor: '#183D3D',
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-b from-[#040D12] to-[#0a1a1a] pt-20">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#183D3D] border-r-transparent"></div>
                            <p className="mt-4 text-gray-300 text-lg">Loading workout data...</p>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    const workoutVolume = calculateVolume()

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-b from-[#040D12] to-[#0a1a1a] pt-20">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-cyan-900/10 to-teal-900/5 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-900/5 to-[#183D3D]/10 rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-4xl mx-auto px-4 py-8">
                    <div className="mb-8">
                        <button
                            onClick={() => navigate("/workout")}
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 mb-6 group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-medium">Back to Workouts</span>
                        </button>

                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent mb-2">
                                    Update Workout
                                </h1>
                                <p className="text-gray-400">
                                    Modify your exercise details and track progress
                                </p>
                            </div>

                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-cyan-900/30 to-cyan-900/10 border border-cyan-500/30">
                                <span className="h-2 w-2 rounded-full bg-cyan-400 mr-2 animate-pulse"></span>
                                <span className="text-sm font-medium text-cyan-200">EDITING MODE</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="bg-gray-900/70 backdrop-blur-xl rounded-3xl p-8 border border-gray-800/50 shadow-2xl">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-900/30 to-cyan-900/10 flex items-center justify-center mr-4">
                                            <Dumbbell className="w-6 h-6 text-cyan-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Editing</p>
                                            <h3 className="text-xl font-bold text-white">
                                                {originalData?.exerciseName}
                                            </h3>
                                        </div>
                                    </div>
                                    {hasChanges() && (
                                        <div className="flex items-center text-emerald-400">
                                            <span className="h-2 w-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
                                            <span className="text-sm font-medium">Unsaved Changes</span>
                                        </div>
                                    )}
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div>
                                        <label className="block text-sm font-medium mb-3 text-gray-300">
                                            Exercise Name
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-sm group-hover:blur transition-all duration-300"></div>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    name="exerciseName"
                                                    value={formData.exerciseName}
                                                    onChange={handleChange}
                                                    className="w-full bg-gray-900/50 border border-gray-700/50 pl-12 pr-4 py-4 rounded-xl outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 text-white placeholder:text-gray-500"
                                                    placeholder="Enter exercise name"
                                                />
                                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                                    <Dumbbell className="w-5 h-5 text-cyan-400" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium mb-3 text-gray-300">
                                                Sets
                                            </label>
                                            <div className="relative group">
                                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-xl blur-sm group-hover:blur transition-all duration-300"></div>
                                                <div className="relative">
                                                    <input
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

                                        <div>
                                            <label className="block text-sm font-medium mb-3 text-gray-300">
                                                Reps per Set
                                            </label>
                                            <div className="relative group">
                                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl blur-sm group-hover:blur transition-all duration-300"></div>
                                                <div className="relative">
                                                    <input
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

                                        <div>
                                            <label className="block text-sm font-medium mb-3 text-gray-300">
                                                Weight (kg)
                                            </label>
                                            <div className="relative group">
                                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-sm group-hover:blur transition-all duration-300"></div>
                                                <div className="relative">
                                                    <input
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
                                    </div>

                                    <div className="pt-6">
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting || !hasChanges()}
                                                className={`flex-[2] flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 ${isSubmitting || !hasChanges()
                                                        ? 'bg-gray-700 cursor-not-allowed'
                                                        : 'bg-gradient-to-r from-[#183D3D] to-emerald-900 hover:from-emerald-900 hover:to-[#183D3D] hover:shadow-2xl hover:scale-[1.02] group'
                                                    }`}
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="w-5 h-5" />
                                                        Save Changes
                                                        <CheckCircle className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                    </>
                                                )}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={handleReset}
                                                disabled={!hasChanges()}
                                                className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl border transition-all duration-300 ${!hasChanges()
                                                        ? 'border-gray-800/50 text-gray-600 cursor-not-allowed'
                                                        : 'border-gray-700/50 text-gray-400 hover:border-orange-500/50 hover:text-orange-400 hover:bg-gray-800/50'
                                                    }`}
                                            >
                                                <RotateCcw className="w-4 h-4" />
                                                Reset
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => navigate("/workout")}
                                                className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl border border-gray-700/50 text-gray-400 hover:border-gray-600 hover:text-white hover:bg-gray-800/50 transition-all duration-300"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-gray-900/70 backdrop-blur-xl rounded-3xl p-6 border border-gray-800/50 shadow-2xl">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                    <TrendingUp className="mr-2 text-emerald-400" />
                                    Progress Tracking
                                </h3>
                                <div className="space-y-4">
                                    <div className="p-4 rounded-lg bg-gradient-to-r from-cyan-900/20 to-cyan-900/10">
                                        <p className="text-xs text-gray-400 mb-1">Original Values</p>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-300">Sets: {originalData?.sets}</span>
                                            <span className="text-gray-300">Reps: {originalData?.reps}</span>
                                            <span className="text-gray-300">Kg: {originalData?.weight}</span>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-lg bg-gradient-to-r from-emerald-900/20 to-emerald-900/10">
                                        <p className="text-xs text-gray-400 mb-1">Current Values</p>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-white">Sets: {formData.sets}</span>
                                            <span className="text-white">Reps: {formData.reps}</span>
                                            <span className="text-white">Kg: {formData.weight}</span>
                                        </div>
                                    </div>
                                    <div className="text-center p-4 rounded-lg bg-gradient-to-r from-gray-800/50 to-gray-900/50">
                                        <p className="text-xs text-gray-400 mb-1">Volume Change</p>
                                        <p className="text-lg font-bold text-white">
                                            {workoutVolume - (originalData ?
                                                originalData.sets * originalData.reps * originalData.weight :
                                                0)} kg
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-900/70 backdrop-blur-xl rounded-3xl p-6 border border-gray-800/50 shadow-2xl">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                    <Info className="mr-2 text-cyan-400" />
                                    Editing Tips
                                </h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start">
                                        <div className="w-6 h-6 rounded-full bg-cyan-900/30 flex items-center justify-center mr-3 mt-0.5">
                                            <span className="text-xs text-cyan-300">✓</span>
                                        </div>
                                        <p className="text-sm text-gray-400">
                                            Small increases in weight lead to steady progress
                                        </p>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="w-6 h-6 rounded-full bg-emerald-900/30 flex items-center justify-center mr-3 mt-0.5">
                                            <span className="text-xs text-emerald-300">✓</span>
                                        </div>
                                        <p className="text-sm text-gray-400">
                                            Update your PRs (Personal Records) here
                                        </p>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="w-6 h-6 rounded-full bg-orange-900/30 flex items-center justify-center mr-3 mt-0.5">
                                            <span className="text-xs text-orange-300">✓</span>
                                        </div>
                                        <p className="text-sm text-gray-400">
                                            Track form improvements in exercise notes
                                        </p>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-gray-900/70 backdrop-blur-xl rounded-3xl p-6 border border-gray-800/50 shadow-2xl">
                                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => navigate("/workout")}
                                        className="w-full py-3 px-4 rounded-xl border border-gray-700/50 hover:border-cyan-500/50 hover:bg-gray-800/50 transition-all duration-300 text-gray-300 hover:text-white flex items-center justify-between"
                                    >
                                        <span>View All Workouts</span>
                                        <ArrowLeft className="w-4 h-4 rotate-180" />
                                    </button>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="w-full py-3 px-4 rounded-xl border border-gray-700/50 hover:border-emerald-500/50 hover:bg-gray-800/50 transition-all duration-300 text-gray-300 hover:text-white flex items-center justify-between"
                                    >
                                        <span>Reload Data</span>
                                        <RotateCcw className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UpdateWorkoutPage