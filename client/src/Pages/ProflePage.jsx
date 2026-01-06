import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import {
    User,
    Mail,
    Calendar,
    Target,
    Activity,
    LogOut,
    Shield,
    Settings,
    Award,
    TrendingUp,
    Edit2,
    ChevronRight,
    Dumbbell,
    Heart
} from 'lucide-react';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
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

                <div className="relative max-w-6xl mx-auto px-4 py-8">
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
                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900/50 border border-gray-800/50 hover:border-cyan-500/50 hover:bg-gray-800/50 transition-all duration-300 text-gray-300 hover:text-white"
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit Profile
                            </button>
                        </div>

                        {/* User Card */}
                        <div className="bg-gray-900/70 backdrop-blur-xl rounded-3xl p-8 border border-gray-800/50 shadow-2xl mb-8">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                                {/* Avatar */}
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#183D3D] to-cyan-900 flex items-center justify-center">
                                        <User className="w-16 h-16 text-cyan-300" />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center border-4 border-[#040D12]">
                                        <Award className="w-5 h-5 text-white" />
                                    </div>
                                </div>

                                {/* User Info */}
                                <div className="flex-1">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                                        <div>
                                            <h2 className="text-3xl font-bold text-white mb-2">
                                                {formatName(profile?.name)}
                                            </h2>
                                            <div className="flex items-center gap-4 text-gray-400">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4" />
                                                    <span>{profile?.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>Member since 2024</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-cyan-900/30 to-cyan-900/10 border border-cyan-500/30">
                                            <span className="h-2 w-2 rounded-full bg-cyan-400 mr-2 animate-pulse"></span>
                                            <span className="text-sm font-medium text-cyan-200">PREMIUM MEMBER</span>
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm text-gray-400">Workouts</span>
                                                <Dumbbell className="w-4 h-4 text-cyan-400" />
                                            </div>
                                            <div className="text-2xl font-bold text-white">{stats.workouts}</div>
                                        </div>
                                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm text-gray-400">Calories</span>
                                                <Activity className="w-4 h-4 text-emerald-400" />
                                            </div>
                                            <div className="text-2xl font-bold text-white">{stats.calories.toLocaleString()}</div>
                                        </div>
                                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm text-gray-400">Day Streak</span>
                                                <TrendingUp className="w-4 h-4 text-orange-400" />
                                            </div>
                                            <div className="text-2xl font-bold text-white">{stats.streak}</div>
                                        </div>
                                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm text-gray-400">Goals</span>
                                                <Target className="w-4 h-4 text-purple-400" />
                                            </div>
                                            <div className="text-2xl font-bold text-white">{stats.goals}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Settings Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {/* Account Settings */}
                            <div className="bg-gray-900/70 backdrop-blur-xl rounded-3xl p-6 border border-gray-800/50 shadow-2xl">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                    <Settings className="mr-3 text-cyan-400" />
                                    Account Settings
                                </h3>
                                <div className="space-y-3">
                                    <button className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300 group">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-900/30 to-cyan-900/10 flex items-center justify-center mr-3">
                                                <Edit2 className="w-5 h-5 text-cyan-400" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-medium text-white">Edit Profile</p>
                                                <p className="text-xs text-gray-400">Update personal information</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-cyan-400" />
                                    </button>
                                    <button className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/50 hover:border-emerald-500/30 transition-all duration-300 group">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-900/30 to-emerald-900/10 flex items-center justify-center mr-3">
                                                <Shield className="w-5 h-5 text-emerald-400" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-medium text-white">Privacy Settings</p>
                                                <p className="text-xs text-gray-400">Control your data visibility</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-emerald-400" />
                                    </button>
                                </div>
                            </div>

                            {/* Fitness Settings */}
                            <div className="bg-gray-900/70 backdrop-blur-xl rounded-3xl p-6 border border-gray-800/50 shadow-2xl">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                    <Dumbbell className="mr-3 text-emerald-400" />
                                    Fitness Settings
                                </h3>
                                <div className="space-y-3">
                                    <button className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/50 hover:border-emerald-500/30 transition-all duration-300 group">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-900/30 to-emerald-900/10 flex items-center justify-center mr-3">
                                                <Target className="w-5 h-5 text-emerald-400" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-medium text-white">Set Goals</p>
                                                <p className="text-xs text-gray-400">Define fitness objectives</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-emerald-400" />
                                    </button>
                                    <button className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300 group">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-900/30 to-orange-900/10 flex items-center justify-center mr-3">
                                                <Heart className="w-5 h-5 text-orange-400" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-medium text-white">Health Metrics</p>
                                                <p className="text-xs text-gray-400">Track vital statistics</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-orange-400" />
                                    </button>
                                </div>
                            </div>

                            {/* Security & Session */}
                            <div className="bg-gray-900/70 backdrop-blur-xl rounded-3xl p-6 border border-gray-800/50 shadow-2xl">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                    <Shield className="mr-3 text-purple-400" />
                                    Security & Session
                                </h3>
                                <div className="space-y-3">
                                    <button className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 group">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-900/30 to-purple-900/10 flex items-center justify-center mr-3">
                                                <Shield className="w-5 h-5 text-purple-400" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-medium text-white">Change Password</p>
                                                <p className="text-xs text-gray-400">Update login credentials</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-purple-400" />
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-red-900/20 to-red-900/10 hover:from-red-800/30 hover:to-red-800/10 border border-red-800/30 hover:border-red-500/50 transition-all duration-300 group"
                                    >
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-red-900/30 to-red-900/10 flex items-center justify-center mr-3">
                                                <LogOut className="w-5 h-5 text-red-400" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-medium text-white">Sign Out</p>
                                                <p className="text-xs text-red-400">End current session</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-red-500 group-hover:text-red-400" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-gray-900/70 backdrop-blur-xl rounded-3xl p-6 border border-gray-800/50 shadow-2xl">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                <Activity className="mr-3 text-cyan-400" />
                                Recent Activity
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/30">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-900/30 to-cyan-900/10 flex items-center justify-center mr-3">
                                            <Dumbbell className="w-5 h-5 text-cyan-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">Bench Press</p>
                                            <p className="text-xs text-gray-400">Today, 08:30 AM • 4 sets × 8 reps × 60kg</p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-cyan-400">PR +5kg</span>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/30">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-900/30 to-emerald-900/10 flex items-center justify-center mr-3">
                                            <Activity className="w-5 h-5 text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">Morning Run</p>
                                            <p className="text-xs text-gray-400">Yesterday • 5km in 28:15</p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-emerald-400">320 cal</span>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/30">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-900/30 to-orange-900/10 flex items-center justify-center mr-3">
                                            <Target className="w-5 h-5 text-orange-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">Goal Achieved</p>
                                            <p className="text-xs text-gray-400">3 days ago • 30-day streak completed</p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-orange-400">🎯 Goal</span>
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
                                    <span>Last login: Today, 08:15 AM</span>
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