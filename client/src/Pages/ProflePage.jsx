import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [weight, setWeight] = useState([])
    const [activeTab, setActiveTab] = useState('overview')
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
            const sortedWeight = response.data.sort((a, b) => 
                new Date(b.updatedAt) - new Date(a.updatedAt)
            );
            setWeight(sortedWeight);
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
            isPositive: change < 0,
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
            cancelButtonText: 'Cancel',
            customClass: {
                popup: 'border border-amber-500/20 shadow-2xl shadow-amber-500/10'
            }
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
                    timer: 1500,
                    showConfirmButton: false
                });
                navigate("/login");
            }
        });
    }

    const handleEditProfile = () => {
        Swal.fire({
            title: "Edit Profile",
            html: `
                <div class="text-left space-y-4">
                    <div>
                        <label class="block text-sm text-gray-300 mb-1">Full Name</label>
                        <input 
                            type="text" 
                            id="editName" 
                            class="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            value="${profile?.name || ''}"
                        >
                    </div>
                    <div>
                        <label class="block text-sm text-gray-300 mb-1">Email</label>
                        <input 
                            type="email" 
                            id="editEmail" 
                            class="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            value="${profile?.email || ''}"
                        >
                    </div>
                </div>
            `,
            background: '#0f172a',
            color: '#ffffff',
            showCancelButton: true,
            confirmButtonColor: '#0ea5e9',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Save Changes',
            cancelButtonText: 'Cancel',
            customClass: {
                popup: 'border border-cyan-500/20 shadow-2xl shadow-cyan-500/10'
            }
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
                <div className="min-h-screen bg-gradient-to-br from-[#040D12] via-[#0a1a1a] to-[#0f2936] pt-20 flex items-center justify-center">
                    <div className="text-center">
                        <div className="relative">
                            <div className="w-20 h-20 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                        <p className="mt-6 text-lg text-cyan-200 font-medium animate-pulse">Loading your fitness profile...</p>
                        <p className="mt-2 text-sm text-gray-400">Getting everything ready for you</p>
                    </div>
                </div>
            </>
        );
    }

    const weightChange = calculateWeightChange();

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-[#040D12] via-[#0a1a1a] to-[#0f2936] text-white overflow-hidden relative">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-cyan-900/20 to-emerald-900/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-purple-900/10 to-pink-900/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-gradient-to-r from-blue-900/5 to-cyan-900/5 rounded-full blur-3xl animate-pulse delay-500"></div>
                </div>

                <div className="absolute inset-0">
                    {[...Array(20)].map((_, i) => (
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
                    .animate-glow {
                        animation: glow 2s ease-in-out infinite alternate;
                    }
                    @keyframes glow {
                        from { box-shadow: 0 0 20px rgba(6, 182, 212, 0.3); }
                        to { box-shadow: 0 0 30px rgba(6, 182, 212, 0.5); }
                    }
                `}</style>

                <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
                    <div className="mb-8">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
                            <div>
                                <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-300 bg-clip-text text-transparent mb-2">
                                    {formatName(profile?.name)}
                                </h1>
                                <p className="text-gray-400 text-lg">Welcome back to your fitness dashboard</p>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleEditProfile}
                                    className="group relative overflow-hidden px-6 py-3 rounded-xl bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-gray-700 hover:border-cyan-500 transition-all duration-300"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <span className="relative flex items-center gap-2 text-gray-300 group-hover:text-white">
                                        <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                        </svg>
                                        Edit Profile
                                    </span>
                                </button>
                                
                                <div className="relative">
                                    <button
                                        onClick={handleLogout}
                                        className="group relative overflow-hidden px-6 py-3 rounded-xl bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-800/30 hover:border-red-500/50 transition-all duration-300"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <span className="relative flex items-center gap-2 text-red-300 group-hover:text-red-200">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                            </svg>
                                            Sign Out
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-2 mb-8">
                            {['overview', 'progress', 'settings', 'achievements'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === tab
                                        ? 'bg-gradient-to-r from-cyan-900/50 to-teal-900/30 text-white border border-cyan-500/30 shadow-lg'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                                    }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 via-teal-500/10 to-emerald-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-800/50 shadow-2xl">
                                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                                        <div className="relative">
                                            <div className="w-36 h-36 rounded-2xl bg-gradient-to-br from-cyan-900 via-teal-900 to-emerald-900 flex items-center justify-center shadow-2xl animate-glow">
                                                <svg className="w-20 h-20 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                                </svg>
                                            </div>
                                            <div className="absolute -bottom-3 -right-3 w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center border-4 border-[#040D12] shadow-2xl">
                                                <span className="text-lg">🏆</span>
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                                                <div>
                                                    <h2 className="text-3xl font-bold text-white mb-3">
                                                        {formatName(profile?.name)}
                                                        <span className="text-cyan-400 ml-2">👋</span>
                                                    </h2>
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <div className="flex items-center gap-2 bg-gradient-to-r from-gray-800/60 to-gray-900/40 px-4 py-2 rounded-xl border border-gray-700/50">
                                                            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                                            </svg>
                                                            <span className="text-gray-300">{profile?.email}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 bg-gradient-to-r from-gray-800/60 to-gray-900/40 px-4 py-2 rounded-xl border border-gray-700/50">
                                                            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                            </svg>
                                                            <span className="text-gray-300">Member since Dec 2024</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4 md:mt-0">
                                                    <div className="inline-flex items-center px-5 py-2 rounded-full bg-gradient-to-r from-cyan-900/40 to-cyan-900/20 border border-cyan-500/30 shadow-lg backdrop-blur-sm">
                                                        <div className="w-3 h-3 rounded-full bg-cyan-400 mr-3 animate-pulse"></div>
                                                        <span className="text-sm font-medium text-cyan-200">ELITE MEMBER</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div className="group relative overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    <div className="relative">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <span className="text-sm text-gray-400">Workouts</span>
                                                            <div className="p-2 rounded-xl bg-cyan-900/40">
                                                                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <div className="text-3xl font-bold text-white mb-1">{stats.workouts}</div>
                                                        <div className="text-xs text-gray-500">This month</div>
                                                    </div>
                                                </div>

                                                <div className="group relative overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50 hover:border-emerald-500/30 transition-all duration-300">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    <div className="relative">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <span className="text-sm text-gray-400">Calories</span>
                                                            <div className="p-2 rounded-xl bg-emerald-900/40 animate-pulse">
                                                                <span className="text-xl">🔥</span>
                                                            </div>
                                                        </div>
                                                        <div className="text-3xl font-bold text-white mb-1">{(stats.calories / 1000).toFixed(1)}k</div>
                                                        <div className="text-xs text-gray-500">Total burned</div>
                                                    </div>
                                                </div>

                                                <div className="group relative overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    <div className="relative">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <span className="text-sm text-gray-400">Day Streak</span>
                                                            <div className="p-2 rounded-xl bg-orange-900/40">
                                                                <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <div className="text-3xl font-bold text-white mb-1">{stats.streak}</div>
                                                        <div className="text-xs text-gray-500">Active days</div>
                                                    </div>
                                                </div>

                                                <div 
                                                    onClick={() => navigate("/AddWeight")}
                                                    className="group relative overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50 hover:border-amber-500/30 transition-all duration-300 cursor-pointer"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    <div className="relative">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <span className="text-sm text-gray-400">Weight</span>
                                                            <div className="p-2 rounded-xl bg-amber-900/40 group-hover:bg-amber-800/50 transition-colors">
                                                                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        {weight.length > 0 ? (
                                                            <div>
                                                                <div className="flex items-end gap-2 mb-1">
                                                                    <div className="text-3xl font-bold text-amber-400">{weight[0]?.weight}</div>
                                                                    <div className="text-lg text-gray-400">kg</div>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${weightChange.isPositive ? 'bg-emerald-900/40 text-emerald-400' : 'bg-red-900/40 text-red-400'}`}>
                                                                        {weightChange.isPositive ? '▼' : '▲'} {weightChange.change} kg ({weightChange.percentage}%)
                                                                    </span>
                                                                    <span className="text-xs text-gray-500">{formatDate(weight[0]?.updatedAt)}</span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-3">
                                                                <div className="text-2xl font-bold text-amber-400 mb-1">No Data</div>
                                                                <div className="text-xs text-gray-500">Tap to add your first weight</div>
                                                            </div>
                                                        )}
                                                        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-800/50">
                                                            <span className="text-xs text-gray-500">Click to update</span>
                                                            <svg className="w-5 h-5 text-amber-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {weight.length > 0 && (
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-800/50 shadow-2xl">
                                        <div className="flex justify-between items-center mb-8">
                                            <div>
                                                <h3 className="text-2xl font-bold text-white mb-2">Weight Progress</h3>
                                                <p className="text-gray-400">Track your fitness transformation over time</p>
                                            </div>
                                            <button
                                                onClick={() => navigate("/AddWeight")}
                                                className="group/btn relative overflow-hidden px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-900/40 to-yellow-900/20 border border-amber-700/30 hover:border-amber-500/50 transition-all duration-300"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                                                <span className="relative flex items-center gap-2 text-amber-400 group-hover/btn:text-amber-300">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                                    </svg>
                                                    Add Entry
                                                </span>
                                            </button>
                                        </div>

                                        <div className="mb-8">
                                            <div className="flex justify-between text-sm mb-6">
                                                <div className="text-gray-400">
                                                    Showing last {Math.min(7, weight.length)} entries
                                                </div>
                                                <div className={`font-medium ${weightChange.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                                                    {weightChange.isPositive ? 'Losing' : 'Gaining'} {weightChange.change} kg ({weightChange.percentage}%)
                                                </div>
                                            </div>
                                            <div className="h-48 flex items-end space-x-4 relative">
                                                {weight.slice(0, 7).map((entry, index) => {
                                                    const entryWeight = entry.weight;
                                                    const allWeights = weight.slice(0, 7).map(w => w.weight);
                                                    const maxWeight = Math.max(...allWeights);
                                                    const minWeight = Math.min(...allWeights);
                                                    const height = maxWeight === minWeight ? 60 : ((entryWeight - minWeight) / (maxWeight - minWeight)) * 100 + 40;

                                                    return (
                                                        <div key={index} className="flex-1 flex flex-col items-center group/bar">
                                                            <div className="relative w-full">
                                                                <div
                                                                    className={`w-full rounded-t-xl transition-all duration-500 ${index === 0 
                                                                        ? 'bg-gradient-to-t from-amber-600 to-yellow-500 shadow-lg' 
                                                                        : 'bg-gradient-to-t from-gray-700 to-gray-600'
                                                                    } group-hover/bar:opacity-90`}
                                                                    style={{ height: `${height}px` }}
                                                                >
                                                                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity duration-300 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap border border-gray-700 shadow-xl">
                                                                        {entry.weight} kg
                                                                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900 border-r border-b border-gray-700"></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="text-xs text-gray-500 mt-3">
                                                                {new Date(entry.updatedAt).toLocaleDateString('en-US', { 
                                                                    day: 'numeric', 
                                                                    month: 'short' 
                                                                })}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <h4 className="text-lg font-semibold text-white mb-4">Recent Entries</h4>
                                            {weight.slice(0, 5).map((entry, index) => (
                                                <div key={index} className="group/entry flex justify-between items-center bg-gradient-to-r from-gray-800/40 to-gray-900/40 rounded-2xl p-4 hover:from-gray-800/60 hover:to-gray-900/60 transition-all duration-300 border border-gray-700/50 hover:border-amber-500/30">
                                                    <div className="flex items-center">
                                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${index === 0 
                                                            ? 'bg-gradient-to-r from-amber-900/40 to-yellow-900/20 animate-pulse'
                                                            : 'bg-gray-700/40'
                                                        }`}>
                                                            <span className="text-xl">⚖️</span>
                                                        </div>
                                                        <div>
                                                            <div className="text-sm text-gray-300 font-medium">
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
                                                        <div className="text-2xl font-bold text-amber-400">{entry.weight} kg</div>
                                                        {index === 0 && (
                                                            <div className="text-xs text-emerald-500 font-medium mt-1">Current</div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-8">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-br from-cyan-500/10 to-teal-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-800/50 shadow-2xl">
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center mr-3 shadow-lg">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                            </svg>
                                        </div>
                                        Quick Actions
                                    </h3>
                                    <div className="space-y-3">
                                        {[
                                            { icon: "📝", label: "Add Workout", color: "from-cyan-900/40 to-cyan-900/20", border: "border-cyan-700/30" },
                                            { icon: "🍎", label: "Log Meal", color: "from-emerald-900/40 to-emerald-900/20", border: "border-emerald-700/30" },
                                            { icon: "🎯", label: "Set Goals", color: "from-purple-900/40 to-purple-900/20", border: "border-purple-700/30" },
                                            { icon: "📊", label: "View Reports", color: "from-orange-900/40 to-orange-900/20", border: "border-orange-700/30" }
                                        ].map((action, index) => (
                                            <button
                                                key={index}
                                                className="group/action w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-800/40 to-gray-900/40 border border-gray-700/50 hover:border-gray-600/70 transition-all duration-300"
                                            >
                                                <div className="flex items-center">
                                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} border ${action.border} flex items-center justify-center mr-4 group-hover/action:scale-110 transition-transform duration-300`}>
                                                        <span className="text-2xl">{action.icon}</span>
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="font-medium text-white">{action.label}</p>
                                                        <p className="text-xs text-gray-400">Quick access</p>
                                                    </div>
                                                </div>
                                                <svg className="w-5 h-5 text-gray-500 group-hover/action:text-white group-hover/action:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                                </svg>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-800/50 shadow-2xl">
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mr-3 shadow-lg">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            </svg>
                                        </div>
                                        Account Settings
                                    </h3>
                                    <div className="space-y-3">
                                        {[
                                            { icon: "👤", label: "Profile Details", desc: "Update personal info" },
                                            { icon: "🔒", label: "Privacy & Security", desc: "Manage preferences" },
                                            { icon: "📱", label: "Notifications", desc: "Configure alerts" },
                                            { icon: "🌐", label: "Preferences", desc: "Customize experience" }
                                        ].map((setting, index) => (
                                            <button
                                                key={index}
                                                className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-800/40 to-gray-900/40 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 group/setting"
                                            >
                                                <div className="flex items-center">
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-gray-700/40 to-gray-800/40 flex items-center justify-center mr-4">
                                                        <span className="text-2xl">{setting.icon}</span>
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="font-medium text-white">{setting.label}</p>
                                                        <p className="text-xs text-gray-400">{setting.desc}</p>
                                                    </div>
                                                </div>
                                                <svg className="w-5 h-5 text-gray-500 group-hover/setting:text-purple-400 group-hover/setting:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                                </svg>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative bg-gradient-to-br from-gray-900/90 to-emerald-900/20 backdrop-blur-xl rounded-3xl p-6 border border-emerald-900/30 shadow-2xl">
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center mr-3 shadow-lg">
                                            <span className="text-xl">❤️</span>
                                        </div>
                                        Health Summary
                                    </h3>
                                    <div className="space-y-4">
                                        {[
                                            { label: "Daily Activity", value: "87%", color: "text-emerald-400", progress: 87 },
                                            { label: "Sleep Quality", value: "7.2h", color: "text-cyan-400", progress: 75 },
                                            { label: "Hydration", value: "2.1L", color: "text-blue-400", progress: 84 },
                                            { label: "Stress Level", value: "Low", color: "text-green-400", progress: 25 }
                                        ].map((metric, index) => (
                                            <div key={index} className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-400">{metric.label}</span>
                                                    <span className={`font-medium ${metric.color}`}>{metric.value}</span>
                                                </div>
                                                <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full bg-gradient-to-r ${index === 0 ? 'from-emerald-500 to-green-500' :
                                                                    index === 1 ? 'from-cyan-500 to-blue-500' :
                                                                    index === 2 ? 'from-blue-500 to-indigo-500' :
                                                                    'from-green-500 to-emerald-500'}`}
                                                        style={{ width: `${metric.progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-800/50">
                        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                            <div className="flex items-center mb-4 md:mb-0 space-x-6">
                                <div className="flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></div>
                                    <span>System: <span className="text-emerald-400 font-medium">Online</span></span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-cyan-400 mr-2"></div>
                                    <span>Last login: Today at {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-400">Fitness Tracker v2.1.0</span>
                                <div className="w-1 h-1 rounded-full bg-gray-700"></div>
                                <span className="text-cyan-400">© 2024 All rights reserved</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;