import React, { useState, useEffect } from 'react'
import Navbar from '../Components/Navbar'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

function AddWeight() {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        weight: ""
    })
    const [weightHistory, setWeightHistory] = useState([])
    const navigate = useNavigate()

    async function fetchProfile() {
        try {
            const token = localStorage.getItem("token")
            const response = await axios.get(
                "http://localhost:3000/auth/profile",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            setProfile(response.data)

            // Fetch weight history if available
            if (response.data?._id) {
                try {
                    const weightRes = await axios.get(`http://localhost:3000/weight/${response.data._id}`)
                    setWeightHistory(weightRes.data || [])
                } catch (err) {
                    console.log("No weight history found")
                }
            }
        } catch (error) {
            console.error(
                "Failed to fetch profile",
                error.response?.data || error.message
            )
        }
    }

    useEffect(() => {
        fetchProfile()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        // Only allow numbers and one decimal point
        const regex = /^\d*\.?\d*$/
        if (regex.test(value) || value === "") {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!profile?._id || !formData.weight) {
            Swal.fire({
                title: "Missing Information",
                text: "Please enter your weight",
                icon: "warning",
                background: '#0a1a1a',
                color: '#ffffff',
                confirmButtonColor: '#183D3D',
            })
            return
        }

        const weightValue = parseFloat(formData.weight)
        if (weightValue < 30 || weightValue > 300) {
            Swal.fire({
                title: "Invalid Weight",
                text: "Please enter a valid weight between 30 and 300 kg",
                icon: "error",
                background: '#0a1a1a',
                color: '#ffffff',
                confirmButtonColor: '#183D3D',
            })
            return
        }

        setLoading(true)
        try {
            await axios.post("http://localhost:3000/weight/", {
                user_id: profile._id,
                weight: weightValue
            })

            await Swal.fire({
                title: "✅ Weight Added!",
                text: "Your weight has been recorded successfully",
                icon: "success",
                background: '#0a1a1a',
                color: '#ffffff',
                confirmButtonColor: '#183D3D',
                timer: 2000
            })

            navigate("/profile")

        } catch (error) {
            console.log(error.response?.data || error.message)
            Swal.fire({
                title: "Error",
                text: error.response?.data?.message || "Failed to add weight. Please try again.",
                icon: "error",
                background: '#0a1a1a',
                color: '#ffffff',
                confirmButtonColor: '#183D3D',
            })
        } finally {
            setLoading(false)
        }
    }

    const handleBack = () => {
        if (formData.weight) {
            Swal.fire({
                title: "Discard Changes?",
                text: "You have entered weight data. Are you sure you want to go back without saving?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Yes, go back',
                cancelButtonText: 'Cancel',
                background: '#0a1a1a',
                color: '#ffffff'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/profile")
                }
            })
        } else {
            navigate("/profile")
        }
    }

    const calculateProgress = () => {
        if (!weightHistory.length) return { change: 0, isPositive: true }

        const latest = weightHistory[0]?.weight
        const previous = weightHistory[1]?.weight

        if (!previous) return { change: 0, isPositive: true }

        const change = latest - previous
        return {
            change: Math.abs(change).toFixed(1),
            isPositive: change <= 0 // Negative change is good (weight loss)
        }
    }

    const progress = calculateProgress()

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#040D12] to-[#0a1a1a]">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Back Button Header */}
                <div className="mb-8">
                    <button
                        onClick={handleBack}
                        className="flex items-center text-gray-400 hover:text-white transition-colors duration-200 group"
                    >
                        <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                        Back to Profile
                    </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-gray-900/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-800 shadow-2xl">
                            {/* Header with Back Button */}
                            <div className="flex justify-between items-start mb-8">
                                <div className="flex items-center">
                                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-yellow-900/30 to-amber-900/30 flex items-center justify-center mr-4">
                                        <svg className="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
                                            Track Your Weight
                                        </h1>
                                        <p className="text-gray-400">Monitor your fitness progress with accurate weight tracking</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleBack}
                                    className="hidden md:flex items-center px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all duration-200"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                    Cancel
                                </button>
                            </div>

                            {/* Stats Overview */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                                    <div className="flex items-center">
                                        <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-amber-900/20 to-yellow-900/20 flex items-center justify-center mr-4">
                                            <span className="text-2xl">⚖️</span>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Current Weight</p>
                                            <p className="text-2xl font-bold text-white">
                                                {weightHistory[0]?.weight ? `${weightHistory[0].weight} kg` : '--'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                                    <div className="flex items-center">
                                        <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-emerald-900/20 to-green-900/20 flex items-center justify-center mr-4">
                                            <span className="text-2xl">📊</span>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Total Entries</p>
                                            <p className="text-2xl font-bold text-white">{weightHistory.length}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                                    <div className="flex items-center">
                                        <div className={`h-12 w-12 rounded-xl ${progress.isPositive ? 'bg-gradient-to-r from-emerald-900/20 to-green-900/20' : 'bg-gradient-to-r from-red-900/20 to-pink-900/20'} flex items-center justify-center mr-4`}>
                                            <span className="text-2xl">{progress.isPositive ? '📉' : '📈'}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Last Change</p>
                                            <p className={`text-2xl font-bold ${progress.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {progress.change > 0 ? `${progress.change} kg` : '--'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Form */}
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div>
                                    <label className="block text-lg font-semibold mb-4 text-gray-300">
                                        <span className="flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                            Today's Weight
                                        </span>
                                    </label>

                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-2xl blur-sm group-hover:blur transition-all duration-300"></div>

                                        <div className="relative">
                                            <div className="flex items-center justify-between bg-gray-800/50 rounded-2xl border border-gray-700 p-1">
                                                <div className="flex-1">
                                                    <input
                                                        required
                                                        type="text"
                                                        name="weight"
                                                        value={formData.weight}
                                                        onChange={handleChange}
                                                        className="w-full bg-transparent text-5xl md:text-6xl font-bold text-center text-white outline-none py-8"
                                                        placeholder="00.0"
                                                        maxLength="6"
                                                    />
                                                </div>
                                                <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                                                    <div className="text-amber-400">
                                                        <div className="text-3xl font-bold">kg</div>
                                                        <div className="text-sm text-gray-500">kilograms</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Weight range slider */}
                                    <div className="mt-8">
                                        <div className="flex justify-between text-sm text-gray-400 mb-2">
                                            <span>30 kg</span>
                                            <span>Current: {formData.weight || "Enter weight"}</span>
                                            <span>300 kg</span>
                                        </div>
                                        <div className="relative h-4">
                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 rounded-full opacity-20"></div>
                                            <div className="absolute inset-0 bg-gray-800 rounded-full"></div>
                                            <div
                                                className="absolute top-0 h-4 bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 rounded-full transition-all duration-500"
                                                style={{
                                                    width: formData.weight
                                                        ? `${((parseFloat(formData.weight) - 30) / 270) * 100}%`
                                                        : '0%'
                                                }}
                                            ></div>
                                            <div
                                                className="absolute top-1/2 transform -translate-y-1/2 h-6 w-6 bg-white rounded-full border-4 border-amber-500 shadow-lg cursor-pointer hover:scale-110 transition-transform duration-200"
                                                style={{
                                                    left: formData.weight
                                                        ? `${Math.min(Math.max(((parseFloat(formData.weight) - 30) / 270) * 100, 0), 100)}%`
                                                        : '0%'
                                                }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                                            <span>Underweight</span>
                                            <span>Healthy</span>
                                            <span>Overweight</span>
                                        </div>
                                    </div>

                                    {/* Quick weight buttons */}
                                    <div className="mt-8">
                                        <p className="text-sm text-gray-400 mb-3">Quick Select:</p>
                                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                                            {[60, 65, 70, 75, 80, 85].map((weight) => (
                                                <button
                                                    type="button"
                                                    key={weight}
                                                    onClick={() => setFormData({ weight: weight.toString() })}
                                                    className={`py-3 rounded-xl font-medium transition-all ${formData.weight === weight.toString()
                                                        ? 'bg-gradient-to-r from-amber-900 to-yellow-900 text-white'
                                                        : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'}`}
                                                >
                                                    {weight} kg
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="flex-1 py-4 rounded-xl font-semibold text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-all duration-300 flex items-center justify-center"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={loading || !formData.weight}
                                        className={`flex-1 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${loading || !formData.weight
                                            ? 'bg-gray-700 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 hover:shadow-xl hover:scale-[1.02] shadow-lg'}`}
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                                                Recording...
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center">
                                                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                                Save Weight
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Column - History & Info */}
                    <div className="space-y-8">
                        {/* Weight Trends */}
                        <div className="bg-gray-900/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-800">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                </svg>
                                Weight Trends
                            </h3>

                            {weightHistory.length > 0 ? (
                                <div className="space-y-4">
                                    {/* Mini chart */}
                                    <div className="h-32 flex items-end space-x-2 mb-6">
                                        {weightHistory.slice(0, 7).reverse().map((entry, index) => {
                                            const weight = entry.weight
                                            const maxWeight = Math.max(...weightHistory.map(w => w.weight))
                                            const minWeight = Math.min(...weightHistory.map(w => w.weight))
                                            const height = ((weight - minWeight) / (maxWeight - minWeight)) * 80 + 20

                                            return (
                                                <div key={index} className="flex-1 flex flex-col items-center">
                                                    <div
                                                        className="w-full rounded-t-lg bg-gradient-to-t from-amber-600 to-yellow-500"
                                                        style={{ height: `${height}px` }}
                                                    ></div>
                                                    <div className="text-xs text-gray-500 mt-2">
                                                        {new Date(entry.date || entry.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {/* Recent entries list */}
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold text-gray-400">Recent Entries</h4>
                                        {weightHistory.slice(0, 5).map((entry, index) => (
                                            <div key={index} className="flex justify-between items-center bg-gray-800/50 rounded-xl p-3">
                                                <div className="flex items-center">
                                                    <div className="h-8 w-8 rounded-lg bg-amber-900/30 flex items-center justify-center mr-3">
                                                        <span className="text-xs">⚖️</span>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-gray-400">
                                                            {new Date(entry.date || entry.createdAt).toLocaleDateString('en-US', {
                                                                weekday: 'short',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-amber-400">{entry.weight} kg</div>
                                                    <div className="text-xs text-gray-500">
                                                        {index === 0 ? 'Latest' : ''}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-5xl mb-4">📊</div>
                                    <h4 className="text-lg font-semibold text-white mb-2">No Weight History</h4>
                                    <p className="text-gray-400 text-sm">Start tracking your weight to see progress trends</p>
                                </div>
                            )}
                        </div>

                        {/* Health Information */}
                        <div className="bg-gradient-to-br from-gray-900 to-amber-900/10 rounded-3xl p-6 border border-amber-900/30">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                Health Tips
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="h-6 w-6 rounded-full bg-amber-900/30 flex items-center justify-center mr-3 mt-1">
                                        <svg className="w-3 h-3 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Consistent Timing</p>
                                        <p className="text-xs text-gray-400">Weigh yourself at the same time each day for accurate tracking</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="h-6 w-6 rounded-full bg-amber-900/30 flex items-center justify-center mr-3 mt-1">
                                        <svg className="w-3 h-3 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Weekly Averages</p>
                                        <p className="text-xs text-gray-400">Focus on weekly trends rather than daily fluctuations</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="h-6 w-6 rounded-full bg-amber-900/30 flex items-center justify-center mr-3 mt-1">
                                        <svg className="w-3 h-3 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Healthy Range</p>
                                        <p className="text-xs text-gray-400">Maintain a healthy weight range for your height and age</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-amber-900/30">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-400">Next Goal</span>
                                    <span className="text-lg font-bold text-amber-400">
                                        {weightHistory[0]?.weight ? `${(parseFloat(weightHistory[0].weight) - 2).toFixed(1)} kg` : '--'}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Aim for healthy, sustainable weight loss of 0.5-1 kg per week</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddWeight