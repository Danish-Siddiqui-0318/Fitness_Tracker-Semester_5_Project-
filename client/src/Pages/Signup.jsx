import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function SignupPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        weight: ""
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordRequirements, setPasswordRequirements] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (name === "password") {
            let strength = 0;
            const requirements = {
                length: value.length >= 8,
                uppercase: /[A-Z]/.test(value),
                lowercase: /[a-z]/.test(value),
                number: /[0-9]/.test(value),
                special: /[^A-Za-z0-9]/.test(value)
            };

            if (requirements.length) strength += 20;
            if (requirements.uppercase) strength += 20;
            if (requirements.lowercase) strength += 20;
            if (requirements.number) strength += 20;
            if (requirements.special) strength += 20;

            setPasswordStrength(strength);
            setPasswordRequirements(requirements);
        }
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength >= 80) return "from-emerald-500 to-green-500";
        if (passwordStrength >= 60) return "from-blue-500 to-cyan-500";
        if (passwordStrength >= 40) return "from-yellow-500 to-orange-500";
        if (passwordStrength >= 20) return "from-orange-500 to-red-500";
        return "from-gray-500 to-gray-600";
    };

    const getStrengthLabel = () => {
        if (passwordStrength >= 80) return "Very Strong";
        if (passwordStrength >= 60) return "Strong";
        if (passwordStrength >= 40) return "Good";
        if (passwordStrength >= 20) return "Weak";
        return "Very Weak";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (passwordStrength < 60) {
            Swal.fire({
                title: "Weak Password",
                text: "Please create a stronger password with at least 8 characters including uppercase, lowercase, numbers, and special characters.",
                icon: "warning",
                background: '#0a1a1a',
                color: '#ffffff',
                confirmButtonColor: '#183D3D',
            });
            return;
        }

        if (formData.password !== confirmPassword) {
            Swal.fire({
                title: "Password Mismatch",
                text: "Passwords do not match. Please try again.",
                icon: "error",
                background: '#0a1a1a',
                color: '#ffffff',
                confirmButtonColor: '#183D3D',
            });
            return;
        }

        const weight = parseFloat(formData.weight);
        if (!weight || weight < 30 || weight > 300) {
            Swal.fire({
                title: "Invalid Weight",
                text: "Please enter a valid weight between 30 and 300 kg.",
                icon: "error",
                background: '#0a1a1a',
                color: '#ffffff',
                confirmButtonColor: '#183D3D',
            });
            return;
        }

        setIsLoading(true);
        try {
            const apiUrl = "http://localhost:3000/auth/register";
            const response = await axios.post(apiUrl, formData);

            Swal.fire({
                title: "🎉 Welcome Aboard!",
                text: "Your fitness journey begins now. Account created successfully!",
                icon: "success",
                background: '#0a1a1a',
                color: '#ffffff',
                confirmButtonColor: '#183D3D',
                showConfirmButton: true,
                showCancelButton: false,
                confirmButtonText: 'Continue to Login'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/login");
                }
            });

        } catch (error) {
            Swal.fire({
                title: "Registration Failed",
                text: error.response?.data?.message || "Please check your information and try again.",
                icon: "error",
                background: '#0a1a1a',
                color: '#ffffff',
                confirmButtonColor: '#183D3D',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#040D12] via-[#0a1a1a] to-[#183D3D] text-white overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-cyan-900/20 to-teal-900/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-r from-emerald-900/10 to-[#183D3D]/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-900/5 to-pink-900/5 rounded-full blur-3xl animate-pulse"></div>
            </div>

            <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-gradient-to-r from-cyan-400/40 to-emerald-400/40 rounded-full animate-float"
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
                    50% { transform: translateY(-20px) translateX(10px); }
                }
                .animate-float {
                    animation: float infinite ease-in-out;
                }
            `}</style>

            <div className="relative w-full max-w-6xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-2 items-center gap-8 lg:gap-12">
                    <div className="relative">
                        <div className="relative overflow-hidden rounded-3xl border border-gray-800/50 shadow-2xl group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-emerald-500/5"></div>
                            <img
                                src="https://images.unsplash.com/photo-1548690312-e3b507d8c110?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
                                className="w-full h-[600px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                                alt="Person celebrating fitness achievement"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-[#040D12]/95 via-[#040D12]/50 to-transparent"></div>

                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className="absolute bottom-0 left-0 right-0 p-8">
                                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 mb-4 backdrop-blur-sm animate-pulse">
                                    <span className="h-2 w-2 rounded-full bg-cyan-400 mr-2 animate-pulse"></span>
                                    <span className="text-sm font-medium text-cyan-200">START YOUR JOURNEY</span>
                                </div>
                                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                    Transform Your Life
                                </h2>
                                <p className="text-gray-300 mb-6 text-lg">Join thousands who have already started their fitness transformation journey with us.</p>

                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { icon: "💪", title: "Personalized Plans", desc: "Custom workout routines" },
                                        { icon: "📊", title: "Progress Analytics", desc: "Detailed insights & reports" },
                                        { icon: "🔥", title: "Nutrition Tracking", desc: "Calorie & macro monitoring" },
                                        { icon: "👥", title: "Community Support", desc: "Join like-minded individuals" }
                                    ].map((feature, index) => (
                                        <div key={index} className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-3 border border-gray-800/50 hover:border-cyan-500/30 hover:scale-105 transition-all duration-300">
                                            <div className="flex items-start">
                                                <div className="text-2xl mr-3">{feature.icon}</div>
                                                <div>
                                                    <p className="font-semibold text-sm text-white">{feature.title}</p>
                                                    <p className="text-xs text-gray-400">{feature.desc}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="absolute -left-6 top-1/4 hidden lg:block animate-bounce">
                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-md rounded-2xl p-4 border border-gray-800/50 shadow-2xl w-56 transform hover:scale-105 transition-transform duration-300">
                                <div className="flex items-center">
                                    <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center mr-3">
                                        <span className="text-xl">🏆</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Trusted By</p>
                                        <p className="font-bold text-xl text-white">25,000+</p>
                                        <p className="text-xs text-gray-500">Active Users</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-gray-800/50 shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute inset-0" style={{
                                    backgroundImage: `radial-gradient(circle at 25% 25%, #183D3D 2px, transparent 2px)`,
                                    backgroundSize: '30px 30px'
                                }}></div>
                            </div>

                            <div className="text-center mb-10 relative">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-600 to-emerald-600 mb-6 shadow-lg transform hover:scale-110 transition-transform duration-300">
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                                    </svg>
                                </div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 via-emerald-200 to-teal-300 bg-clip-text text-transparent mb-3">
                                    Join Us Today
                                </h1>
                                <p className="text-gray-400">Begin your transformation in just a few steps</p>
                            </div>

                            <form className="space-y-8 relative" onSubmit={handleSubmit}>
                                <div>
                                    <label className="block text-sm font-medium mb-3 text-gray-300">
                                        <span className="flex items-center">
                                            <svg className="w-4 h-4 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                            </svg>
                                            Full Name
                                        </span>
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl blur-sm group-hover:blur-lg transition-all duration-300"></div>
                                        <div className="relative">
                                            <input
                                                onChange={handleChange}
                                                name="name"
                                                type="text"
                                                required
                                                className="w-full bg-gray-900/70 border border-gray-700/70 pl-12 pr-4 py-4 rounded-xl outline-none focus:border-cyan-500/70 focus:ring-2 focus:ring-cyan-500/30 transition-all duration-300 backdrop-blur-sm"
                                                placeholder="Enter your full name"
                                            />
                                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-3 text-gray-300">
                                        <span className="flex items-center">
                                            <svg className="w-4 h-4 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                            </svg>
                                            Email Address
                                        </span>
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-xl blur-sm group-hover:blur-lg transition-all duration-300"></div>
                                        <div className="relative">
                                            <input
                                                onChange={handleChange}
                                                name="email"
                                                type="email"
                                                required
                                                className="w-full bg-gray-900/70 border border-gray-700/70 pl-12 pr-4 py-4 rounded-xl outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all duration-300 backdrop-blur-sm"
                                                placeholder="you@example.com"
                                            />
                                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-3 text-gray-300">
                                        <span className="flex items-center">
                                            <svg className="w-4 h-4 mr-2 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
                                            </svg>
                                            Current Weight
                                        </span>
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-xl blur-sm group-hover:blur-lg transition-all duration-300"></div>
                                        <div className="relative">
                                            <input
                                                onChange={handleChange}
                                                name="weight"
                                                type="number"
                                                required
                                                min="30"
                                                max="300"
                                                step="0.1"
                                                className="w-full bg-gray-900/70 border border-gray-700/70 pl-12 pr-16 py-4 rounded-xl outline-none focus:border-amber-500/70 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300 backdrop-blur-sm"
                                                placeholder="75.5"
                                            />
                                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
                                                </svg>
                                            </div>
                                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                                                <span className="text-amber-400 font-medium">kg</span>
                                                <span className="text-gray-500 text-xs hidden sm:inline">(kilograms)</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="text-xs text-gray-500">Enter weight in kilograms</p>
                                        <div className="flex space-x-1">
                                            {[60, 70, 80, 90].map((w) => (
                                                <button
                                                    key={w}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, weight: w.toString() })}
                                                    className="text-xs px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                                                >
                                                    {w}kg
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-3 text-gray-300">
                                        <span className="flex items-center">
                                            <svg className="w-4 h-4 mr-2 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                            </svg>
                                            Password
                                        </span>
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl blur-sm group-hover:blur-lg transition-all duration-300"></div>
                                        <div className="relative">
                                            <input
                                                onChange={handleChange}
                                                name="password"
                                                type={showPassword ? "text" : "password"}
                                                required
                                                className="w-full bg-gray-900/70 border border-gray-700/70 pl-12 pr-12 py-4 rounded-xl outline-none focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/30 transition-all duration-300 backdrop-blur-sm"
                                                placeholder="Create a strong password"
                                            />
                                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                                <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                                </svg>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                                            >
                                                {showPassword ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                                                    </svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {formData.password && (
                                        <div className="mt-4 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-400">Password Strength</span>
                                                <span className={`text-sm font-semibold ${passwordStrength >= 80 ? 'text-emerald-400' : passwordStrength >= 60 ? 'text-blue-400' : passwordStrength >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                                                    {getStrengthLabel()}
                                                </span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full bg-gradient-to-r ${getPasswordStrengthColor()} transition-all duration-500`}
                                                    style={{ width: `${passwordStrength}%` }}
                                                ></div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 mt-3">
                                                {Object.entries(passwordRequirements).map(([key, met]) => {
                                                    const labels = {
                                                        length: "8+ characters",
                                                        uppercase: "Uppercase letter",
                                                        lowercase: "Lowercase letter",
                                                        number: "Number",
                                                        special: "Special character"
                                                    };
                                                    return (
                                                        <div key={key} className="flex items-center">
                                                            <div className={`w-3 h-3 rounded-full mr-2 ${met ? 'bg-emerald-500' : 'bg-gray-700'}`}></div>
                                                            <span className={`text-xs ${met ? 'text-emerald-400' : 'text-gray-500'}`}>
                                                                {labels[key]}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-3 text-gray-300">
                                        <span className="flex items-center">
                                            <svg className="w-4 h-4 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                            Confirm Password
                                        </span>
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl blur-sm group-hover:blur-lg transition-all duration-300"></div>
                                        <div className="relative">
                                            <input
                                                onChange={handleConfirmPasswordChange}
                                                value={confirmPassword}
                                                type={showPassword ? "text" : "password"}
                                                required
                                                className="w-full bg-gray-900/70 border border-gray-700/70 pl-12 pr-4 py-4 rounded-xl outline-none focus:border-purple-500/70 focus:ring-2 focus:ring-purple-500/30 transition-all duration-300 backdrop-blur-sm"
                                                placeholder="Re-enter your password"
                                            />
                                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {confirmPassword && formData.password && (
                                        <div className="mt-3 flex items-center">
                                            {confirmPassword === formData.password ? (
                                                <>
                                                    <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center mr-2">
                                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                        </svg>
                                                    </div>
                                                    <span className="text-emerald-400 text-sm font-medium">Passwords match</span>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center mr-2">
                                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                                        </svg>
                                                    </div>
                                                    <span className="text-red-400 text-sm font-medium">Passwords do not match</span>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-start bg-gray-900/50 rounded-xl p-4 border border-gray-800/50">
                                    <input
                                        id="terms"
                                        name="terms"
                                        type="checkbox"
                                        required
                                        className="h-5 w-5 mt-1 text-emerald-500 bg-gray-800 border-gray-700 rounded focus:ring-emerald-500/30 focus:ring-2"
                                    />
                                    <label htmlFor="terms" className="ml-3 text-sm text-gray-400">
                                        I agree to the{" "}
                                        <span className="text-emerald-400 hover:text-emerald-300 cursor-pointer">Terms of Service</span>
                                        {" "}and{" "}
                                        <span className="text-emerald-400 hover:text-emerald-300 cursor-pointer">Privacy Policy</span>
                                    </label>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg text-white shadow-lg transition-all duration-300 transform hover:scale-[1.02] ${isLoading
                                            ? 'bg-gray-700 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-cyan-600 via-emerald-600 to-teal-600 hover:from-cyan-700 hover:via-emerald-700 hover:to-teal-700 hover:shadow-2xl'
                                            }`}
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center justify-center">
                                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                                                Creating Your Account...
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center">
                                                <span className="text-lg">Start Your Journey</span>
                                                <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                </div>

                                <div className="text-center pt-4">
                                    <p className="text-gray-400">
                                        Already have an account?{" "}
                                        <Link to="/login" className="font-semibold text-emerald-400 hover:text-emerald-300 hover:underline transition-colors duration-200">
                                            Sign in here
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignupPage;