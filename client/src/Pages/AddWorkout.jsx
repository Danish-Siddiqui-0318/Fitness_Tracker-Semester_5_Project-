import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PlusCircle, Dumbbell, Hash, Repeat, Scale } from 'lucide-react';
import Swal from 'sweetalert2';
import Navbar from '../Components/Navbar'
import { useNavigate } from 'react-router-dom';

const ExerciseForm = () => {

    const navigate=useNavigate()
    const [profile, setProfile] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        sets: '',
        reps: '',
        weight: ''
    });

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

    // ================= HANDLE SUBMIT =================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!profile || !profile._id) return;

        const payload = {
            user_id: profile._id,
            exerciseName: formData.name, // 👈 FIX
            sets: formData.sets,
            reps: formData.reps,
            weight: formData.weight
        };

        try {
            var response = await axios.post(
                "http://localhost:3000/workout/",
                payload
            );

            console.log("Exercise Submitted:", payload);
            Swal.fire({
                title: "Registered Successfully",
                text: response.data.message,
                icon: "success",
            });

            // optional reset (UX choice)
            setFormData({
                name: '',
                sets: '',
                reps: '',
                weight: ''
            });
            navigate("/workout")

        } catch (error) {
            console.error(
                "Failed to save workout",
                error.response?.data || error.message
            );
        }
    };

    // ================= LOAD PROFILE ONCE =================
    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <>
        <Navbar/>
            <div className="min-h-screen bg-slate-50 p-6 flex justify-center items-start mt-20">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border">
                    <header className="mb-8">
                        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                            <PlusCircle className="text-blue-600" /> Log Exercise
                        </h2>
                        <p className="text-slate-500 text-sm">
                            Track your progress and stay consistent.
                        </p>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Exercise Name */}
                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                Exercise Name
                            </label>
                            <div className="relative">
                                <Dumbbell className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input
                                    required
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 py-3 border rounded-xl"
                                />
                            </div>
                        </div>

                        {/* Sets / Reps / Weight */}
                        <div className="grid grid-cols-3 gap-3">

                            <input
                                required
                                type="number"
                                name="sets"
                                value={formData.sets}
                                onChange={handleChange}
                                placeholder="Sets"
                                className="p-3 border rounded-xl"
                            />

                            <input
                                required
                                type="number"
                                name="reps"
                                value={formData.reps}
                                onChange={handleChange}
                                placeholder="Reps"
                                className="p-3 border rounded-xl"
                            />

                            <input
                                required
                                type="number"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                placeholder="Weight"
                                className="p-3 border rounded-xl"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-4 rounded-2xl"
                        >
                            Save Exercise
                        </button>

                    </form>
                </div>
            </div>
        </>
    );
};

export default ExerciseForm;
