import axios from "axios";
import React, { useEffect, useState } from "react";

export function Hero() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    workoutsThisWeek: 5,
    caloriesBurned: 1240,
    streak: 12,
  });
  const [currentStat, setCurrentStat] = useState(0);

  async function fetchProfile() {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = "http://localhost:3000/auth/profile";
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(response.data);
    } catch (error) {
      console.error(
        "Failed to fetch profile",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  }

  const formatName = (name) => {
    if (!name) return "";
    return name
      .replace(/[0-9]/g, "")
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const statsData = [
    {
      label: "Workouts This Week",
      value: stats.workoutsThisWeek,
      color: "from-cyan-500 to-blue-500",
    },
    {
      label: "Calories Burned",
      value: stats.caloriesBurned,
      color: "from-emerald-500 to-green-500",
    },
    {
      label: "Day Streak",
      value: stats.streak,
      color: "from-orange-500 to-red-500",
    },
  ];

  useEffect(() => {
    fetchProfile();

    // Auto-rotate stats
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % statsData.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="relative w-full min-h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#183D3D] border-r-transparent"></div>
          <p className="mt-4 text-gray-300">Loading your fitness profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#040D12] via-[#0a1a1a] to-[#040D12] opacity-90"></div>

      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-900/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-900/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8 lg:pt-32 lg:pb-24">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
          <div className="lg:col-span-7 xl:col-span-7">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-[#183D3D]/30 to-cyan-900/30 border border-[#183D3D]/50 mb-6">
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 mr-2 animate-pulse"></span>
              <span className="text-sm font-medium text-cyan-200">
                WELCOME BACK
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              <span className="block text-gray-300">Hello,</span>
              <span className="block bg-gradient-to-r from-cyan-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent">
                {formatName(profile?.name || "Fitness Champion")}
              </span>
            </h1>

            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-300 mb-6">
              Track Your Progress,{" "}
              <span className="relative inline-block">
                <span className="relative z-10">Reach Your Peak</span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-gradient-to-r from-[#183D3D]/40 to-cyan-900/40 -z-10"></span>
              </span>
            </h2>

            <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl leading-relaxed">
              Monitor your daily activity, heart rate, and sleep patterns with
              precision. Join thousands of users reaching their health goals
              every day.
            </p>

            <div className="mb-8">
              <div className="relative h-40 bg-gray-900/50 rounded-2xl border border-gray-800/50 p-6 backdrop-blur-sm">
                <div className="h-full flex flex-col justify-center">
                  <div className="flex items-center mb-4">
                    <div
                      className={`h-10 w-10 rounded-lg bg-gradient-to-r ${statsData[currentStat].color} flex items-center justify-center mr-4`}
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">
                        {statsData[currentStat].label}
                      </p>
                      <p className="text-3xl font-bold text-white">
                        {statsData[currentStat].value}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    {statsData.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentStat(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          index === currentStat
                            ? "w-8 bg-gradient-to-r from-cyan-500 to-teal-500"
                            : "w-2 bg-gray-700 hover:bg-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                className="group relative px-8 py-4 bg-gradient-to-r from-[#183D3D] to-teal-900 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center"
              >
                <span className="relative z-10">Check Your Workout</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-700 to-teal-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <svg
                  className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </button>

              <button
                type="button"
                className="group px-8 py-4 rounded-xl font-semibold text-white border-2 border-gray-700 hover:border-cyan-500/50 hover:bg-gray-900/50 transition-all duration-300 flex items-center justify-center backdrop-blur-sm"
              >
                Check Your Calories
                <svg
                  className="w-5 h-5 ml-3 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </button>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-800/50">
              <p className="text-sm text-gray-400 mb-4">
                Trusted by fitness enthusiasts worldwide
              </p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-8 w-8 rounded-full border-2 border-gray-900 bg-gradient-to-br from-cyan-500 to-teal-500"
                      ></div>
                    ))}
                  </div>
                  <span className="ml-3 text-sm text-gray-300">
                    10K+ Active Users
                  </span>
                </div>
                <div className="h-4 w-px bg-gray-800"></div>
                <div className="text-sm text-gray-300">
                  <span className="text-cyan-400">4.9</span> ★ Average Rating
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 xl:col-span-5 mt-12 lg:mt-0">
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-[#040D12]/80 via-transparent to-transparent z-10"></div>

                <img
                  className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                  src="https://i.ibb.co/qLgqVN3D/Gemini-Generated-Image-4oma7j4oma7j4oma.png"
                  alt="Fitness tracking dashboard and user"
                />

                <div className="absolute bottom-6 left-6 right-6 z-20">
                  <div className="bg-gray-900/80 backdrop-blur-md rounded-xl p-4 border border-gray-800/50">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">98%</div>
                        <div className="text-xs text-gray-400">Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">
                          24/7
                        </div>
                        <div className="text-xs text-gray-400">Tracking</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">99%</div>
                        <div className="text-xs text-gray-400">
                          Satisfaction
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-tr from-[#183D3D]/20 to-cyan-900/20 rounded-full blur-xl"></div>

              <div className="absolute -left-6 top-1/4 hidden lg:block">
                <div className="bg-gray-900/80 backdrop-blur-md rounded-xl p-4 border border-gray-800/50 shadow-xl w-48">
                  <div className="flex items-center mb-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Active Time</p>
                      <p className="font-semibold text-white">45 min</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-6 bottom-1/4 hidden lg:block">
                <div className="bg-gray-900/80 backdrop-blur-md rounded-xl p-4 border border-gray-800/50 shadow-xl w-48">
                  <div className="flex items-center mb-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Calories</p>
                      <p className="font-semibold text-white">320 burned</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
