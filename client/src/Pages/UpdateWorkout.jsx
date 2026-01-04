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
} from "lucide-react"
import Navbar from "../Components/Navbar"

const UpdateWorkoutPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)

    const [formData, setFormData] = useState({
        exerciseName: "",
        sets: "",
        reps: "",
        weight: "",
    })

    // 🔹 GET SINGLE WORKOUT
    useEffect(() => {
        async function fetchWorkout() {
            try {
                const res = await axios.get(
                    `http://localhost:3000/workout/single/${id}`
                )

                setFormData({
                    exerciseName: res.data.exerciseName,
                    sets: res.data.sets,
                    reps: res.data.reps,
                    weight: res.data.weight,
                })
            } catch (error) {
                console.error("Failed to fetch workout", error)
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

    // 🔹 UPDATE WORKOUT
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            await axios.put(
                `http://localhost:3000/workout/${id}`,
                formData
            )
            navigate("/workout")
        } catch (error) {
            console.error("Failed to update workout", error)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-lg">
                Loading...
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black p-4 md:p-8">
            <Navbar />
            <div className="mx-auto max-w-lg">
                {/* Navigation */}
                <div className="mb-6 flex items-center justify-between">
                    <button
                        onClick={() => navigate("/workout")}
                        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
                    >
                        <ArrowLeft size={16} /> Back
                    </button>

                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Editing Mode
                    </span>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60 ring-1 ring-black/5">
                    <header className="mb-8">
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight mb-3">
                            Update Workout
                        </h1>

                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-100">
                            <Info size={14} className="text-blue-500" />
                            <p className="text-sm font-medium text-blue-700">
                                Currently modifying:{" "}
                                <span className="font-bold underline">
                                    {formData.exerciseName}
                                </span>
                            </p>
                        </div>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Exercise Name */}
                        <div>
                            <label className="mb-2 block ml-1 text-sm font-bold text-slate-700">
                                Exercise Name
                            </label>
                            <div className="relative">
                                <Dumbbell
                                    className="absolute left-4 top-3.5 text-slate-400"
                                    size={18}
                                />
                                <input
                                    type="text"
                                    name="exerciseName"
                                    value={formData.exerciseName}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700"
                                />
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="mb-2 block ml-1 text-[10px] font-black uppercase tracking-tighter text-slate-400">
                                    Sets
                                </label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-3.5 text-slate-400" size={14} />
                                    <input
                                        type="number"
                                        name="sets"
                                        value={formData.sets}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-8 pr-2 outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block ml-1 text-[10px] font-black uppercase tracking-tighter text-slate-400">
                                    Reps
                                </label>
                                <div className="relative">
                                    <Repeat className="absolute left-3 top-3.5 text-slate-400" size={14} />
                                    <input
                                        type="number"
                                        name="reps"
                                        value={formData.reps}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-8 pr-2 outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block ml-1 text-[10px] font-black uppercase tracking-tighter text-slate-400">
                                    Weight (kg)
                                </label>
                                <div className="relative">
                                    <Scale className="absolute left-3 top-3.5 text-slate-400" size={14} />
                                    <input
                                        type="number"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-8 pr-2 outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="pt-6 flex flex-col sm:flex-row gap-3">
                            <button
                                type="submit"
                                className="flex-[2] flex items-center justify-center gap-2 rounded-2xl bg-green-600 py-4 text-sm font-bold text-white shadow-xl hover:bg-slate-800"
                            >
                                <Save size={18} /> Save Changes
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/workout")}
                                className="flex-1 rounded-2xl border border-slate-200 py-4 text-sm font-bold text-slate-400 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default UpdateWorkoutPage
