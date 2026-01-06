import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function SignupPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (name === "password") {
            // Calculate password strength
            let strength = 0;
            if (value.length >= 8) strength += 25;
            if (/[A-Z]/.test(value)) strength += 25;
            if (/[0-9]/.test(value)) strength += 25;
            if (/[^A-Za-z0-9]/.test(value)) strength += 25;
            setPasswordStrength(strength);
        }
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength >= 75) return "from-emerald-500 to-green-500";
        if (passwordStrength >= 50) return "from-yellow-500 to-orange-500";
        if (passwordStrength >= 25) return "from-orange-500 to-red-500";
        return "from-gray-500 to-gray-600";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate password match
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

        setIsLoading(true);
        try {
            const apiUrl = "http://localhost:3000/auth/register";
            const response = await axios.post(apiUrl, formData);

            Swal.fire({
                title: "Welcome Aboard!",
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
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-cyan-900/20 to-teal-900/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-r from-emerald-900/10 to-[#183D3D]/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-900/5 to-teal-900/5 rounded-full blur-3xl"></div>
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-emerald-400/30 rounded-full animate-pulse"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${1 + Math.random() * 2}s`
                        }}
                    ></div>
                ))}
            </div>

            <div className="relative w-full max-w-6xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-2 items-center gap-8 lg:gap-12">
                    {/* Left side - Image and welcome message */}
                    <div className="relative">
                        <div className="relative overflow-hidden rounded-3xl border border-gray-800/50 shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1534367507877-0edd93bd013b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
                                className="w-full h-[600px] object-cover transform hover:scale-105 transition-transform duration-700"
                                alt="Fitness community"
                            />
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#040D12]/90 via-transparent to-transparent"></div>

                            {/* Text overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-8">
                                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 mb-4 backdrop-blur-sm">
                                    <span className="h-2 w-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
                                    <span className="text-sm font-medium text-emerald-200">START YOUR JOURNEY</span>
                                </div>
                                <h2 className="text-3xl font-bold mb-4">Join Our Fitness Community</h2>
                                <p className="text-gray-300 mb-6">Track your progress, achieve your goals, and transform your life with our comprehensive fitness platform.</p>

                                {/* Features list */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-start">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center mr-3 mt-1">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Personalized Plans</p>
                                            <p className="text-xs text-gray-400">Custom workout routines</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center mr-3 mt-1">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Progress Analytics</p>
                                            <p className="text-xs text-gray-400">Detailed insights & reports</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center mr-3 mt-1">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Nutrition Tracking</p>
                                            <p className="text-xs text-gray-400">Calorie & macro monitoring</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-3 mt-1">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Community Support</p>
                                            <p className="text-xs text-gray-400">Join like-minded individuals</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating stats card */}
                        <div className="absolute -left-6 top-1/4 hidden lg:block">
                            <div className="bg-gray-900/80 backdrop-blur-md rounded-xl p-4 border border-gray-800/50 shadow-xl w-56 transform hover:scale-105 transition-transform duration-300">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center mr-3">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Community Members</p>
                                        <p className="font-bold text-white">25,000+</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Signup form */}
                    <div className="relative">
                        <div className="bg-gray-900/70 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-gray-800/50 shadow-2xl">
                            {/* Header */}
                            <div className="text-center mb-10">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#183D3D] to-emerald-900 mb-6">
                                    <svg className="w-8 h-8 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                                    </svg>
                                </div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-300 via-cyan-200 to-teal-300 bg-clip-text text-transparent mb-3">
                                    Create Account
                                </h1>
                                <p className="text-gray-400">Start your fitness transformation today</p>
                            </div>

                            <form className="space-y-8" onSubmit={handleSubmit}>
                                {/* Name field */}
                                <div>
                                    <label className="block text-sm font-medium mb-3 text-gray-300">
                                        Full Name
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-sm group-hover:blur transition-all duration-300"></div>
                                        <div className="relative">
                                            <input
                                                onChange={handleChange}
                                                name="name"
                                                type="text"
                                                required
                                                className="w-full bg-gray-900/50 border border-gray-700/50 pl-12 pr-4 py-4 rounded-xl outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
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

                                {/* Email field */}
                                <div>
                                    <label className="block text-sm font-medium mb-3 text-gray-300">
                                        Email Address
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-xl blur-sm group-hover:blur transition-all duration-300"></div>
                                        <div className="relative">
                                            <input
                                                onChange={handleChange}
                                                name="email"
                                                type="email"
                                                required
                                                className="w-full bg-gray-900/50 border border-gray-700/50 pl-12 pr-4 py-4 rounded-xl outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
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

                                {/* Password field */}
                                <div>
                                    <label className="block text-sm font-medium mb-3 text-gray-300">
                                        Password
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl blur-sm group-hover:blur transition-all duration-300"></div>
                                        <div className="relative">
                                            <input
                                                onChange={handleChange}
                                                name="password"
                                                type={showPassword ? "text" : "password"}
                                                required
                                                className="w-full bg-gray-900/50 border border-gray-700/50 pl-12 pr-12 py-4 rounded-xl outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
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

                                    {/* Password strength indicator */}
                                    {formData.password && (
                                        <div className="mt-3">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-gray-400">Password strength</span>
                                                <span className={`font-medium ${passwordStrength >= 75 ? 'text-emerald-400' : passwordStrength >= 50 ? 'text-yellow-400' : passwordStrength >= 25 ? 'text-orange-400' : 'text-gray-400'}`}>
                                                    {passwordStrength >= 75 ? 'Strong' : passwordStrength >= 50 ? 'Medium' : passwordStrength >= 25 ? 'Weak' : 'Very Weak'}
                                                </span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full bg-gradient-to-r ${getPasswordStrengthColor()} transition-all duration-300`}
                                                    style={{ width: `${passwordStrength}%` }}
                                                ></div>
                                            </div>
                                            <div className="mt-2 text-xs text-gray-500">
                                                <p>Use at least 8 characters with uppercase, lowercase, numbers, and symbols</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password field */}
                                <div>
                                    <label className="block text-sm font-medium mb-3 text-gray-300">
                                        Confirm Password
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-sm group-hover:blur transition-all duration-300"></div>
                                        <div className="relative">
                                            <input
                                                onChange={handleConfirmPasswordChange}
                                                value={confirmPassword}
                                                type={showPassword ? "text" : "password"}
                                                required
                                                className="w-full bg-gray-900/50 border border-gray-700/50 pl-12 pr-4 py-4 rounded-xl outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                                                placeholder="Re-enter your password"
                                            />
                                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Password match indicator */}
                                    {confirmPassword && formData.password && (
                                        <div className="mt-2">
                                            {confirmPassword === formData.password ? (
                                                <div className="flex items-center text-emerald-400 text-sm">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                    Passwords match
                                                </div>
                                            ) : (
                                                <div className="flex items-center text-red-400 text-sm">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                                    </svg>
                                                    Passwords do not match
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Terms agreement */}
                                <div className="flex items-start">
                                    <input
                                        id="terms"
                                        name="terms"
                                        type="checkbox"
                                        required
                                        className="h-4 w-4 mt-1 text-emerald-500 bg-gray-800 border-gray-700 rounded focus:ring-emerald-500/20 focus:ring-2"
                                    />
                                    <label htmlFor="terms" className="ml-3 text-sm text-gray-400">
                                        I agree to the{" "}
                                        <a href="#" className="text-emerald-400 hover:text-emerald-300 hover:underline">
                                            Terms of Service
                                        </a>{" "}
                                        and{" "}
                                        <a href="#" className="text-emerald-400 hover:text-emerald-300 hover:underline">
                                            Privacy Policy
                                        </a>
                                    </label>
                                </div>

                                {/* Submit button */}
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`w-full py-4 px-6 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 ${isLoading
                                            ? 'bg-gray-700 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-[#183D3D] to-emerald-900 hover:from-emerald-900 hover:to-[#183D3D] hover:shadow-2xl hover:scale-[1.02]'
                                            }`}
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center justify-center">
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                                                Creating Account...
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center">
                                                <span>Start Your Journey</span>
                                                <svg className="w-5 h-5 ml-3 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                </div>

                                {/* Divider */}
                                <div className="relative py-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-800"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="px-4 bg-gray-900/70 text-sm text-gray-500">Or sign up with</span>
                                    </div>
                                </div>

                                {/* Social signup options */}
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        className="flex items-center justify-center py-3 px-4 rounded-xl border border-gray-700/50 hover:border-gray-600 hover:bg-gray-800/50 transition-all duration-300 group"
                                    >
                                        <svg className="w-5 h-5 mr-3 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                        <span className="text-sm font-medium group-hover:text-white transition-colors duration-300">Facebook</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="flex items-center justify-center py-3 px-4 rounded-xl border border-gray-700/50 hover:border-gray-600 hover:bg-gray-800/50 transition-all duration-300 group"
                                    >
                                        <svg className="w-5 h-5 mr-3 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                                        </svg>
                                        <span className="text-sm font-medium group-hover:text-white transition-colors duration-300">Google</span>
                                    </button>
                                </div>

                                {/* Login link */}
                                <div className="text-center pt-8 border-t border-gray-800/50">
                                    <p className="text-gray-400">
                                        Already have an account?{" "}
                                        <Link to="/login" className="font-medium text-emerald-400 hover:text-emerald-300 hover:underline transition-colors duration-200">
                                            Sign in here
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-full blur-xl"></div>
                        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-[#183D3D]/10 to-emerald-900/10 rounded-full blur-xl"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignupPage;