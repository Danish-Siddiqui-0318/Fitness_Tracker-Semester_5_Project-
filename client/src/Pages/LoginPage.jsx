import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

function LoginPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const apiUrl = "http://localhost:3000/auth/login";
            const response = await axios.post(apiUrl, formData);

            localStorage.setItem("token", response.data.token);

            Swal.fire({
                title: "Welcome Back!",
                text: "Successfully logged into your fitness journey",
                icon: "success",
                background: '#0a1a1a',
                color: '#ffffff',
                confirmButtonColor: '#183D3D',
            });

            navigate("/");
        } catch (error) {
            Swal.fire({
                title: "Login Failed",
                text: error.response?.data?.message || "Please check your credentials",
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
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-cyan-900/20 to-teal-900/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-900/10 to-[#183D3D]/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-900/5 to-teal-900/5 rounded-full blur-3xl"></div>
            </div>

            <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-pulse"
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
                    <div className="relative">
                        <div className="relative overflow-hidden rounded-3xl border border-gray-800/50 shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
                                className="w-full h-[600px] object-cover transform hover:scale-105 transition-transform duration-700"
                                alt="Fitness motivation"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#040D12]/90 via-transparent to-transparent"></div>

                            <div className="absolute bottom-0 left-0 right-0 p-8">
                                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 mb-4 backdrop-blur-sm">
                                    <span className="h-2 w-2 rounded-full bg-cyan-400 mr-2 animate-pulse"></span>
                                    <span className="text-sm font-medium text-cyan-200">FITNESS TRACKER</span>
                                </div>
                                <h2 className="text-3xl font-bold mb-4">Your Journey to Peak Fitness Starts Here</h2>
                                <p className="text-gray-300 mb-2">Track workouts, monitor progress, and achieve your goals with precision.</p>
                                <div className="flex items-center mt-6 space-x-6">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center mr-2">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <span className="text-sm">Real-time Tracking</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center mr-2">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                        </div>
                                        <span className="text-sm">24/7 Analytics</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute -right-6 top-1/4 hidden lg:block">
                            <div className="bg-gray-900/80 backdrop-blur-md rounded-xl p-4 border border-gray-800/50 shadow-xl w-56 transform hover:scale-105 transition-transform duration-300">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center mr-3">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Active Users</p>
                                        <p className="font-bold text-white">10,000+</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="bg-gray-900/70 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-gray-800/50 shadow-2xl">
                            <div className="text-center mb-10">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#183D3D] to-cyan-900 mb-6">
                                    <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                </div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 via-emerald-200 to-teal-300 bg-clip-text text-transparent mb-3">
                                    Welcome Back
                                </h1>
                                <p className="text-gray-400">Sign in to continue your fitness journey</p>
                            </div>

                            <form className="space-y-8" onSubmit={handleSubmit}>
                                <div>
                                    <label className="block text-sm font-medium mb-3 text-gray-300">
                                        Email Address
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-xl blur-sm group-hover:blur transition-all duration-300"></div>
                                        <div className="relative">
                                            <input
                                                onChange={handleChange}
                                                name="email"
                                                type="email"
                                                required
                                                className="w-full bg-gray-900/50 border border-gray-700/50 pl-12 pr-4 py-4 rounded-xl outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                                                placeholder="you@example.com"
                                            />
                                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-3 text-gray-300">
                                        Password
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-xl blur-sm group-hover:blur transition-all duration-300"></div>
                                        <div className="relative">
                                            <input
                                                onChange={handleChange}
                                                name="password"
                                                type={showPassword ? "text" : "password"}
                                                required
                                                className="w-full bg-gray-900/50 border border-gray-700/50 pl-12 pr-12 py-4 rounded-xl outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                                                placeholder="Enter your password"
                                            />
                                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                </div>

                                <div className="flex justify-end">
                                    <a href="#" className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline transition-colors duration-200">
                                        Forgot your password?
                                    </a>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`w-full py-4 px-6 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 ${isLoading
                                            ? 'bg-gray-700 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-[#183D3D] to-cyan-900 hover:from-cyan-900 hover:to-[#183D3D] hover:shadow-2xl hover:scale-[1.02]'
                                            }`}
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center justify-center">
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                                                Signing In...
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center">
                                                <span>Login Now</span>
                                                <svg className="w-5 h-5 ml-3 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                </div>

                                

                                

                                <div className="text-center pt-8 border-t border-gray-800/50">
                                    <p className="text-gray-400">
                                        Don't have an account?{" "}
                                        <Link to="/signup" className="font-medium text-cyan-400 hover:text-cyan-300 hover:underline transition-colors duration-200">
                                            Sign up now
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>

                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-teal-500/10 rounded-full blur-xl"></div>
                        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-[#183D3D]/10 to-cyan-900/10 rounded-full blur-xl"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;