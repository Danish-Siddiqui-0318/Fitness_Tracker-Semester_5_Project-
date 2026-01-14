import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [weight, setWeight] = useState([])
    const [stats, setStats] = useState({
        workouts: 42,
        calories: 12560,
        streak: 28,
        goals: 12
    })
    const navigate = useNavigate()

    async function fetchProfile() {
        try {
            const token = localStorage.getItem("token");
            const apiUrl = "http://localhost:3000/auth/profile"
            const response = await axios.get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProfile(response.data);
        } catch (error) {
            console.error("Failed to fetch profile", error.response?.data || error.message);
        } finally {
            setLoading(false)
        }
    }

    async function fetchWeight() {
        try {
            const userid = profile._id;
            const response = await axios.get(`http://localhost:3000/weight/${userid}`)
            // Sort weights by date descending to get latest first
            const sortedWeight = response.data.sort((a, b) => 
                new Date(b.updatedAt) - new Date(a.updatedAt)
            );
            setWeight(sortedWeight);
            console.log(sortedWeight);
        } catch (error) {
            console.log(error)
        }
    }

    const formatName = (name) => {
        if (!name) return "Fitness Champion";
        return name
            .replace(/[0-9]/g, "")
            .trim()
            .split(" ")
            .filter(Boolean)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            const now = new Date();
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);

            if (date.toDateString() === now.toDateString()) return 'Today';
            if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    };

    const calculateWeightChange = () => {
        if (weight.length < 2) return { change: 0, isPositive: true, percentage: 0 };

        const latest = weight[0]?.weight;
        const previous = weight[1]?.weight;

        if (!previous) return { change: 0, isPositive: true, percentage: 0 };

        const change = latest - previous;
        const percentage = ((change / previous) * 100).toFixed(1);

        return {
            change: Math.abs(change).toFixed(1),
            isPositive: change < 0, // Negative change is good (weight loss)
            percentage: Math.abs(percentage)
        };
    };

    const handleLogout = () => {
        Swal.fire({
            title: "Log Out?",
            text: "Are you sure you want to sign out?",
            icon: "warning",
            background: '#0a1a1a',
            color: '#ffffff',
            showCancelButton: true,
            confirmButtonColor: '#183D3D',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Log Out',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("token");
                Swal.fire({
                    title: "Logged Out",
                    text: "You have been logged out successfully",
                    icon: "success",
                    background: '#0a1a1a',
                    color: '#ffffff',
                    confirmButtonColor: '#183D3D',
                });
                navigate("/login");
            }
        });
    }

    const handleEditProfile = () => {
        Swal.fire({
            title: "Coming Soon",
            text: "Profile editing feature will be available soon!",
            icon: "info",
            background: '#0a1a1a',
            color: '#ffffff',
            confirmButtonColor: '#183D3D',
        });
    }

    useEffect(() => {
        fetchProfile()
    }, [])

    useEffect(() => {
        if (profile?._id) {
            fetchWeight();
        }
    }, [profile]);

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-b from-[#040D12] to-[#0a1a1a] pt-20">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#183D3D] border-r-transparent"></div>
                            <p className="mt-4 text-gray-300 text-lg">Loading your profile...</p>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    const weightChange = calculateWeightChange();

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-b from-[#040D12] to-[#0a1a1a] pt-20">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-cyan-900/10 to-teal-900/5 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-900/5 to-[#183D3D]/10 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-900/5 to-pink-900/5 rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 py-8">
                    {/* Header Section */}
                    <div className="mb-12">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 via-emerald-200 to-teal-300 bg-clip-text text-transparent mb-2">
                                    My Profile
                                </h1>
                                <p className="text-gray-400">Manage your account and track your fitness journey</p>
                            </div>
                            <button
                                onClick={handleEditProfile}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700 hover:border-cyan-500 hover:bg-gray-800/70 transition-all duration-300 text-gray-300 hover:text-white group"
                            >
                                <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                                Edit Profile
                            </button>
                        </div>

                        {/* Main Profile Card */}
                        <div className="bg-gray-900/70 backdrop-blur-xl rounded-3xl p-8 border border-gray-800/50 shadow-2xl mb-8">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                                {/* Avatar Section */}
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#183D3D] via-cyan-900 to-emerald-900 flex items-center justify-center shadow-lg">
                                        <svg className="w-16 h-16 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                        </svg>
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center border-4 border-[#040D12] shadow-lg">
                                        <span className="text-sm font-bold">🏆</span>
                                    </div>
                                </div>

                                {/* User Info Section */}
                                <div className="flex-1">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                                        <div>
                                            <h2 className="text-3xl font-bold text-white mb-2">
                                                {formatName(profile?.name)}
                                            </h2>
                                            <div className="flex flex-wrap items-center gap-4 text-gray-400">
                                                <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-lg">
                                                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                                    </svg>
                                                    <span className="text-sm">{profile?.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-lg">
                                                    <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                    </svg>
                                                    <span className="text-sm">Joined Dec 2024</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-cyan-900/30 to-cyan-900/10 border border-cyan-500/30 shadow-lg">
                                            <span className="h-2 w-2 rounded-full bg-cyan-400 mr-2 animate-pulse"></span>
                                            <span className="text-sm font-medium text-cyan-200">ACTIVE MEMBER</span>
                                        </div>
                                    </div>

                                    {/* Stats Grid - Improved */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {/* Workouts Card */}
                                        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-sm text-gray-400">Workouts</span>
                                                <div className="p-2 rounded-lg bg-cyan-900/30">
                                                    <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="text-2xl font-bold text-white">{stats.workouts}</div>
                                            <div className="text-xs text-gray-500 mt-2">This month</div>
                                        </div>

                                        {/* Calories Card */}
                                        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50 hover:border-emerald-500/30 transition-all duration-300">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-sm text-gray-400">Calories</span>
                                                <div className="p-2 rounded-lg bg-emerald-900/30">
                                                    <span className="text-lg">🔥</span>
                                                </div>
                                            </div>
                                            <div className="text-2xl font-bold text-white">{(stats.calories / 1000).toFixed(1)}k</div>
                                            <div className="text-xs text-gray-500 mt-2">Total burned</div>
                                        </div>

                                        {/* Streak Card */}
                                        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-sm text-gray-400">Day Streak</span>
                                                <div className="p-2 rounded-lg bg-orange-900/30">
                                                    <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="text-2xl font-bold text-white">{stats.streak}</div>
                                            <div className="text-xs text-gray-500 mt-2">Active days</div>
                                        </div>

                                        {/* Weight Card - Enhanced */}
                                        <div
                                            onClick={() => navigate("/AddWeight")}
                                            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50 hover:border-amber-500/30 hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-sm text-gray-400">Current Weight</span>
                                                <div className="p-2 rounded-lg bg-amber-900/30 group-hover:bg-amber-800/40 transition-colors">
                                                    <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                            {weight.length > 0 ? (
                                                <div>
                                                    <div className="flex items-end gap-2">
                                                        {/* Show latest weight (first in sorted array) */}
                                                        <div className="text-2xl font-bold text-amber-400">{weight[0]?.weight}</div>
                                                        <div className="text-lg text-gray-400">kg</div>
                                                    </div>
                                                    <div className="flex items-center mt-2">
                                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${weightChange.isPositive ? 'bg-emerald-900/30 text-emerald-400' : 'bg-red-900/30 text-red-400'}`}>
                                                            {weightChange.isPositive ? '▼' : '▲'} {weightChange.change} kg ({weightChange.percentage}%)
                                                        </span>
                                                        <span className="text-xs text-gray-500 ml-2">{formatDate(weight[0]?.updatedAt)}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center py-3">
                                                    <div className="text-lg font-bold text-amber-400 mb-1">No Data</div>
                                                    <div className="text-xs text-gray-500">Tap to add your first weight</div>
                                                </div>
                                            )}
                                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-800/50">
                                                <span className="text-xs text-gray-500">Click to update</span>
                                                <svg className="w-4 h-4 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Weight History Section */}
                        {weight.length > 0 && (
                            <div className="bg-gray-900/70 backdrop-blur-xl rounded-3xl p-6 border border-gray-800/50 shadow-2xl mb-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-white flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                        </svg>
                                        Weight History
                                    </h3>
                                    <button
                                        onClick={() => navigate("/AddWeight")}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-900/30 to-yellow-900/20 border border-amber-700/30 hover:border-amber-500/50 hover:bg-amber-900/10 transition-all duration-300 text-amber-400 hover:text-amber-300"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                        </svg>
                                        Add New
                                    </button>
                                </div>

                                {/* Weight Progress Chart */}
                                <div className="mb-8">
                                    <div className="flex justify-between text-sm text-gray-400 mb-4">
                                        <span>Progress Over Time</span>
                                        <span className={`${weightChange.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {weightChange.isPositive ? 'Losing' : 'Gaining'} {weightChange.change} kg
                                        </span>
                                    </div>
                                    <div className="h-40 flex items-end space-x-2 relative">
                                        {weight.slice(0, 7).map((entry, index) => {
                                            const entryWeight = entry.weight;
                                            const allWeights = weight.slice(0, 7).map(w => w.weight);
                                            const maxWeight = Math.max(...allWeights);
                                            const minWeight = Math.min(...allWeights);
                                            const height = maxWeight === minWeight ? 60 : ((entryWeight - minWeight) / (maxWeight - minWeight)) * 80 + 20;

                                            return (
                                                <div key={index} className="flex-1 flex flex-col items-center relative">
                                                    <div
                                                        className={`w-full rounded-t-lg relative group ${index === 0 ? 'bg-gradient-to-t from-amber-600 to-yellow-500' : 'bg-gray-700'}`}
                                                        style={{ height: `${height}px` }}
                                                    >
                                                        {/* Weight label on hover */}
                                                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                                            {entry.weight} kg
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-2">
                                                        {new Date(entry.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                                    </div>
                                                    {/* Weight value shown on bar */}
                                                    <div className="absolute bottom-full mb-1 text-xs font-medium text-gray-300">
                                                        {entry.weight}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Recent Weight Entries - Show all with pagination if needed */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-sm font-semibold text-gray-400">Recent Entries ({weight.length} total)</h4>
                                        {weight.length > 5 && (
                                            <span className="text-xs text-amber-400">
                                                Showing latest 5 of {weight.length}
                                            </span>
                                        )}
                                    </div>
                                    {weight.slice(0, 5).map((entry, index) => (
                                        <div key={index} className="flex justify-between items-center bg-gray-800/50 rounded-xl p-4 hover:bg-gray-800/70 transition-all duration-300">
                                            <div className="flex items-center">
                                                <div className={`h-10 w-10 rounded-lg ${index === 0 ? 'bg-gradient-to-r from-amber-900/30 to-yellow-900/20' : 'bg-gray-700/30'} flex items-center justify-center mr-4`}>
                                                    <span className="text-lg">⚖️</span>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-400">
                                                        {formatDate(entry.updatedAt)}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {new Date(entry.updatedAt).toLocaleTimeString('en-US', {
                                                            hour: 'numeric',
                                                            minute: '2-digit',
                                                            hour12: true
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xl font-bold text-amber-400">{entry.weight} kg</div>
                                                {index === 0 && (
                                                    <div className="text-xs text-emerald-500 font-medium">Current</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {weight.length > 5 && (
                                        <div className="text-center pt-4">
                                            <button
                                                onClick={() => {
                                                    // You could implement a modal to show all weights here
                                                    Swal.fire({
                                                        title: "All Weight Entries",
                                                        html: `
                                                            <div class="text-left">
                                                                ${weight.map((entry, index) => `
                                                                    <div class="flex justify-between items-center py-2 border-b border-gray-700/50">
                                                                        <div>
                                                                            <div class="text-white">${formatDate(entry.updatedAt)}</div>
                                                                            <div class="text-xs text-gray-400">${new Date(entry.updatedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</div>
                                                                        </div>
                                                                        <div class="text-amber-400 font-bold">${entry.weight} kg</div>
                                                                    </div>
                                                                `).join('')}
                                                            </div>
                                                        `,
                                                        background: '#0a1a1a',
                                                        color: '#ffffff',
                                                        confirmButtonColor: '#183D3D',
                                                        width: '500px'
                                                    });
                                                }}
                                                className="text-sm text-amber-400 hover:text-amber-300 hover:underline transition-colors duration-200"
                                            >
                                                View All {weight.length} Entries →
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Settings Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {/* Account Settings */}
                            <div className="bg-gradient-to-br from-gray-900/70 to-gray-900/50 backdrop-blur-xl rounded-3xl p-6 border border-gray-800/50 shadow-2xl">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    </svg>
                                    Account Settings
                                </h3>
                                <div className="space-y-3">
                                    <button className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300 group">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-900/30 to-cyan-900/10 flex items-center justify-center mr-3">
                                                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                                </svg>
                                            </div>
                                            <div className="text-left">
                                                <p className="font-medium text-white">Edit Profile</p>
                                                <p className="text-xs text-gray-400">Update personal information</p>
                                            </div>
                                        </div>
                                        <svg className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                        </svg>
                                    </button>
                                    <button className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/50 hover:border-emerald-500/30 transition-all duration-300 group">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-900/30 to-emerald-900/10 flex items-center justify-center mr-3">
                                                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                                </svg>
                                            </div>
                                            <div className="text-left">
                                                <p className="font-medium text-white">Privacy Settings</p>
                                                <p className="text-xs text-gray-400">Control your data visibility</p>
                                            </div>
                                        </div>
                                        <svg className="w-5 h-5 text-gray-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Fitness Settings */}
                            <div className="bg-gradient-to-br from-gray-900/70 to-gray-900/50 backdrop-blur-xl rounded-3xl p-6 border border-gray-800/50 shadow-2xl">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                    </svg>
                                    Fitness Settings
                                </h3>
                                <div className="space-y-3">
                                    <button className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/50 hover:border-emerald-500/30 transition-all duration-300 group">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-900/30 to-emerald-900/10 flex items-center justify-center mr-3">
                                                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19l3-3m0 0l3-3m-3 3V5"></path>
                                                </svg>
                                            </div>
                                            <div className="text-left">
                                                <p className="font-medium text-white">Set Goals</p>
                                                <p className="text-xs text-gray-400">Define fitness objectives</p>
                                            </div>
                                        </div>
                                        <svg className="w-5 h-5 text-gray-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                        </svg>
                                    </button>
                                    <button className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300 group">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-900/30 to-orange-900/10 flex items-center justify-center mr-3">
                                                <span className="text-lg">❤️</span>
                                            </div>
                                            <div className="text-left">
                                                <p className="font-medium text-white">Health Metrics</p>
                                                <p className="text-xs text-gray-400">Track vital statistics</p>
                                            </div>
                                        </div>
                                        <svg className="w-5 h-5 text-gray-500 group-hover:text-orange-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Security & Session */}
                            <div className="bg-gradient-to-br from-gray-900/70 to-gray-900/50 backdrop-blur-xl rounded-3xl p-6 border border-gray-800/50 shadow-2xl">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                    </svg>
                                    Security & Session
                                </h3>
                                <div className="space-y-3">
                                    <button className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 group">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-900/30 to-purple-900/10 flex items-center justify-center mr-3">
                                                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                                                </svg>
                                            </div>
                                            <div className="text-left">
                                                <p className="font-medium text-white">Change Password</p>
                                                <p className="text-xs text-gray-400">Update login credentials</p>
                                            </div>
                                        </div>
                                        <svg className="w-5 h-5 text-gray-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                        </svg>
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-red-900/20 to-red-900/10 hover:from-red-800/30 hover:to-red-800/10 border border-red-800/30 hover:border-red-500/50 transition-all duration-300 group"
                                    >
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-red-900/30 to-red-900/10 flex items-center justify-center mr-3">
                                                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                                </svg>
                                            </div>
                                            <div className="text-left">
                                                <p className="font-medium text-white">Sign Out</p>
                                                <p className="text-xs text-red-400">End current session</p>
                                            </div>
                                        </div>
                                        <svg className="w-5 h-5 text-red-500 group-hover:text-red-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-12 pt-8 border-t border-gray-800/50">
                        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                            <div className="flex items-center mb-4 md:mb-0">
                                <div className="flex items-center mr-6">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></div>
                                    <span>System Status: <span className="text-emerald-400 font-medium">Online</span></span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-cyan-400 mr-2"></div>
                                    <span>Last login: {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
                                </div>
                            </div>
                            <div>
                                <span>© 2024 Fitness Tracker • v2.1.0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;