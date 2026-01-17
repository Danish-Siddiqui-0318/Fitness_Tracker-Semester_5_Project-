import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Navbar from '../Components/Navbar';

function Feedback() {
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState("");
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [charCount, setCharCount] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!profile || !profile._id) {
            Swal.fire({
                title: "Login Required",
                text: "Please login to submit feedback",
                icon: "warning",
                background: '#0a1a1a',
                color: '#ffffff',
                confirmButtonColor: '#183D3D',
            });
            return;
        }

        if (!feedback.trim()) {
            Swal.fire({
                title: "Empty Feedback",
                text: "Please write some feedback before submitting",
                icon: "error",
                background: '#0a1a1a',
                color: '#ffffff',
                confirmButtonColor: '#183D3D',
            });
            return;
        }

        setLoading(true);
        const payload = {
            user_id: profile._id,
            feedback: feedback
        };

        try {
            await axios.post("http://localhost:3000/feedback/", payload);

            await Swal.fire({
                title: "🎉 Feedback Sent!",
                text: "Thank you for your valuable feedback!",
                icon: "success",
                background: '#0a1a1a',
                color: '#ffffff',
                confirmButtonColor: '#183D3D',
                timer: 2000
            });

            navigate("/");

        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Submission Failed",
                text: error.response?.data?.message || "Failed to submit feedback. Please try again.",
                icon: "error",
                background: '#0a1a1a',
                color: '#ffffff',
                confirmButtonColor: '#183D3D',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFeedbackChange = (e) => {
        const value = e.target.value;
        setFeedback(value);
        setCharCount(value.length);
    };

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

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#040D12] to-[#0a1a1a]">
            <Navbar />

            <div className="pt-20 pb-12 px-4">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-emerald-900/10 to-green-900/5 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-cyan-900/5 to-teal-900/10 rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 mb-4">
                            <span className="h-2 w-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
                            <span className="text-sm font-medium text-emerald-200">SHARE YOUR THOUGHTS</span>
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-300 via-cyan-200 to-teal-300 bg-clip-text text-transparent mb-4">
                            Share Your Feedback
                        </h1>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Your opinion helps us improve. Share your experience, suggestions, or report any issues you've encountered.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="bg-gray-900/70 backdrop-blur-xl rounded-3xl p-8 border border-gray-800/50 shadow-2xl">
                                <div className="flex items-center mb-8">
                                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-900/30 to-green-900/30 flex items-center justify-center mr-4">
                                        <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Send Your Feedback</h2>
                                        <p className="text-gray-400">Help us make your fitness journey better</p>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div>
                                        <div className="flex justify-between items-center mb-3">
                                            <label className="block text-sm font-semibold text-gray-300">
                                                Your Message
                                            </label>
                                            <span className={`text-sm ${charCount > 500 ? 'text-red-400' : 'text-gray-500'}`}>
                                                {charCount}/500
                                            </span>
                                        </div>
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-2xl blur-sm group-hover:blur transition-all duration-300"></div>
                                            <div className="relative">
                                                <textarea
                                                    rows="6"
                                                    value={feedback}
                                                    onChange={handleFeedbackChange}
                                                    placeholder="What do you like about our app? What can we improve? Share your thoughts..."
                                                    maxLength="500"
                                                    className="w-full p-4 rounded-2xl bg-gray-800/50 border border-gray-700/50 text-white outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 resize-none backdrop-blur-sm"
                                                    required
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-gray-800/30 to-gray-900/30 rounded-xl p-4 border border-gray-700/30">
                                        <div className="flex items-start">
                                            <div className="h-6 w-6 rounded-full bg-emerald-900/30 flex items-center justify-center mr-3 mt-1">
                                                <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white mb-1">Tips for helpful feedback</p>
                                                <ul className="text-xs text-gray-400 space-y-1">
                                                    <li>• Be specific about what you liked or didn't like</li>
                                                    <li>• Include suggestions for improvement</li>
                                                    <li>• Mention any bugs or issues encountered</li>
                                                    <li>• Share your experience with specific features</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex space-x-4">
                                        <button
                                            type="button"
                                            onClick={() => navigate("/")}
                                            className="flex-1 py-3 rounded-xl font-semibold text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-all duration-300 flex items-center justify-center"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                            </svg>
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={loading || !feedback.trim()}
                                            className={`flex-1 py-3 rounded-xl font-semibold text-lg transition-all duration-300 ${loading || !feedback.trim()
                                                    ? 'bg-gray-700 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 hover:shadow-xl hover:scale-[1.02] shadow-lg'
                                                }`}
                                        >
                                            {loading ? (
                                                <div className="flex items-center justify-center">
                                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                                                    Sending...
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center">
                                                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                                    </svg>
                                                    Send Feedback
                                                </div>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-gray-900/70 backdrop-blur-xl rounded-3xl p-6 border border-gray-800/50 shadow-2xl">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    What Happens Next?
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-900/30 to-cyan-900/10 flex items-center justify-center mr-3">
                                            <span className="text-sm font-bold text-cyan-400">1</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">Review by Team</p>
                                            <p className="text-xs text-gray-400">Your feedback is reviewed by our development team</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-emerald-900/30 to-emerald-900/10 flex items-center justify-center mr-3">
                                            <span className="text-sm font-bold text-emerald-400">2</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">Implementation</p>
                                            <p className="text-xs text-gray-400">Valuable suggestions are added to our roadmap</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-amber-900/30 to-amber-900/10 flex items-center justify-center mr-3">
                                            <span className="text-sm font-bold text-amber-400">3</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">Updates</p>
                                            <p className="text-xs text-gray-400">We regularly update based on user feedback</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-gray-900 to-emerald-900/10 rounded-3xl p-6 border border-emerald-900/30 shadow-2xl">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                    </svg>
                                    Feedback Impact
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 text-sm">Total Feedback</span>
                                        <span className="text-xl font-bold text-emerald-400">1,200+</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 text-sm">Features Added</span>
                                        <span className="text-xl font-bold text-cyan-400">45+</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 text-sm">Bugs Fixed</span>
                                        <span className="text-xl font-bold text-amber-400">120+</span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-emerald-900/30">
                                    <p className="text-xs text-gray-400">
                                        Your feedback directly contributes to improving the app for everyone.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gray-900/70 backdrop-blur-xl rounded-3xl p-6 border border-gray-800/50 shadow-2xl">
                                <h3 className="text-lg font-bold text-white mb-4">Popular Feedback Topics</h3>
                                <div className="space-y-3">
                                    {[
                                        "Workout tracking features",
                                        "Calorie counting accuracy",
                                        "User interface improvements",
                                        "New exercise suggestions",
                                        "App performance & bugs"
                                    ].map((topic, index) => (
                                        <div key={index} className="flex items-center text-sm">
                                            <div className="h-2 w-2 rounded-full bg-emerald-400 mr-3"></div>
                                            <span className="text-gray-300">{topic}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-gray-500 text-sm">
                            We value your privacy. Your feedback will be used solely for improving our services.
                        </p>
                        <p className="text-gray-600 text-xs mt-2">
                            Thank you for helping us create a better fitness tracking experience!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Feedback;