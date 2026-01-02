import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    async function fetchProfile() {
        try {
            const token = localStorage.getItem("token");

            var apiUrl = "http://localhost:3000/auth/profile"
            const response = await axios.get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            );

            setProfile(response.data);
            console.log(response.data)
        } catch (error) {
            console.error("Failed to fetch profile", error.response?.data || error.message);
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        Swal.fire({
            title: "Logged Out",
            text: "You have been logged out successfully",
            icon: "success",
        })

        navigate("/login")
    }

    useEffect(() => {
        fetchProfile()
    }, [])

    if (loading) {
        return <div className="text-white mt-20">Loading...</div>;
    }
    return (
        <>
            <Navbar />
            <div className="min-h-screen w-full bg-white flex flex-col">
                {/* Top Header Section - Expanded */}
                <div className="w-full bg-green-500 pt-20 pb-16 px-6 md:px-12 flex flex-col justify-end">
                    <div className="max-w-4xl mx-auto w-full">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                            Hi! {profile?.name
                                ? profile.name
                                    .replace(/[0-9]/g, "")      // remove numbers
                                    .trim()
                                    .split(" ")
                                    .filter(Boolean)
                                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                    .join(" ")
                                : ""}
                        </h1>
                        <p className="text-indigo-100 text-lg md:text-xl mt-3 font-medium opacity-90">
                           Email: {profile.email}
                        </p>
                    </div>
                </div>

                {/* Content Section - Takes up remaining height */}
                <div className="flex-1 w-full bg-black px-6 md:px-12 py-10">
                    <div className="max-w-4xl mx-auto w-full">

                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
                                Account Security & Session
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Change Password Button */}
                                <button className="flex items-center justify-between bg-white border border-slate-200 p-5 rounded-2xl hover:border-indigo-300 hover:shadow-md transition-all duration-200 group">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-600 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-600 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <span className="block text-base font-bold text-slate-800">Change Password</span>
                                            <span className="text-xs text-slate-500">Update your login credentials</span>
                                        </div>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-300 group-hover:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>

                                {/* Logout Button */}
                                <button className="flex items-center justify-between bg-white border border-red-100 p-5 rounded-2xl hover:bg-red-50 hover:border-red-200 transition-all duration-200 group"
                                    onClick={handleLogout}>
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-red-50 rounded-xl group-hover:bg-red-500 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-600 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <span className="block text-base font-bold text-red-700">Sign Out</span>
                                            <span className="text-xs text-red-400">End your current session</span>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Additional Full-Width Info Placeholder */}

                    </div>
                </div>

                {/* Footer */}
                <div className="w-full py-6 px-6 md:px-12 bg-black ">
                    <div className="max-w-4xl mx-auto flex justify-between items-center text-xs text-slate-400 font-medium">
                        <span>&copy; 2026 Fitness Tracker</span>
                        <span>System Status: Online</span>
                    </div>
                </div>
            </div>
        </>

    );
};

export default ProfilePage;