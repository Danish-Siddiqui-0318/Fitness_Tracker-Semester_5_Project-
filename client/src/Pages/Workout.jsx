import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ExerciseCard from "../Components/Cards";

function Workout() {
  const [profile, setProfile] = useState(null);
  const [workout, setWorkout] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalSets: 0,
    totalReps: 0,
    totalWeight: 0
  });
  const [filter, setFilter] = useState("all");

  const navigate = useNavigate();

  async function fetchProfile() {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:3000/auth/profile", {
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
    }
  }

  async function deleteWorkout(id) {
    try {
      await axios.delete(`http://localhost:3000/workout/${id}`);

      setWorkout(prev => {
        const updated = prev.filter(item => item._id !== id);
        setStats(calculateStats(updated));
        return updated;
      });

    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  }


  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function calculateStats(workouts) {
    const totalSets = workouts.reduce((sum, item) => sum + item.sets, 0);
    const totalReps = workouts.reduce((sum, item) => sum + item.reps, 0);
    const totalWeight = workouts.reduce((sum, item) => sum + (item.weight || 0), 0);

    return {
      totalWorkouts: workouts.length,
      totalSets,
      totalReps,
      totalWeight: Math.round(totalWeight)
    };
  }

  async function fetchWorkout(userId) {
    try {
      setLoading(true);

      const response = await axios.get(
        `http://localhost:3000/workout/${userId}`
      );

      const sortedWorkouts = response.data.sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );

      setWorkout(sortedWorkouts);
      setStats(calculateStats(sortedWorkouts));
    } catch (error) {
      console.error(
        "Failed to fetch workouts",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  }

  const getFilteredWorkouts = () => {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    switch (filter) {
      case "today":
        return workout.filter(item =>
          new Date(item.createdAt).toDateString() === today.toDateString()
        );
      case "week":
        return workout.filter(item =>
          new Date(item.createdAt) >= lastWeek
        );
      case "month":
        return workout.filter(item =>
          new Date(item.createdAt) >= lastMonth
        );
      default:
        return workout;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile?._id) {
      fetchWorkout(profile._id);
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
              <p className="mt-4 text-gray-300 text-lg">Loading your workouts...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  const filteredWorkouts = getFilteredWorkouts();

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-[#040D12] to-[#0a1a1a] pt-20">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 via-transparent to-emerald-900/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent mb-2">
                  Your Workouts
                </h1>
                <p className="text-gray-400">
                  Track, manage, and analyze your fitness journey
                </p>
              </div>

              <button
                onClick={() => navigate("/addWorkout")}
                className="group relative px-6 py-3 bg-gradient-to-r from-[#183D3D] to-cyan-900 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center"
              >
                <span className="relative z-10 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Add New Workout
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-700 to-teal-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Total Workouts</p>
                    <p className="text-2xl font-bold text-white">{stats.totalWorkouts}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-r from-cyan-900/30 to-cyan-900/10">
                    <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Total Sets</p>
                    <p className="text-2xl font-bold text-white">{stats.totalSets}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-r from-emerald-900/30 to-emerald-900/10">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Total Reps</p>
                    <p className="text-2xl font-bold text-white">{stats.totalReps}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-r from-orange-900/30 to-orange-900/10">
                    <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Total Weight</p>
                    <p className="text-2xl font-bold text-white">{stats.totalWeight} kg</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-r from-purple-900/30 to-purple-900/10">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl font-semibold text-white">Your Exercise History</h2>

                <div className="flex space-x-2 bg-gray-900/50 backdrop-blur-sm rounded-xl p-1 border border-gray-800/50">
                  {["all", "today", "week", "month"].map((filterType) => (
                    <button
                      key={filterType}
                      onClick={() => setFilter(filterType)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${filter === filterType
                        ? 'bg-gradient-to-r from-[#183D3D] to-cyan-900 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                        }`}
                    >
                      {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {filteredWorkouts.length === 0 ? (
                <div className="text-center py-16 bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800/50">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-gray-800 to-gray-900 mb-6">
                    <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No Workouts Found</h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    {filter === "all"
                      ? "You haven't added any workouts yet. Start your fitness journey by adding your first workout!"
                      : `No workouts found for ${filter}. Try a different filter or add new workouts.`
                    }
                  </p>
                  <button
                    onClick={() => navigate("/addWorkout")}
                    className="px-6 py-3 bg-gradient-to-r from-[#183D3D] to-cyan-900 rounded-xl font-semibold text-white hover:shadow-xl transition-all duration-300 inline-flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Add Your First Workout
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {filteredWorkouts.map((item) => (
                      <div key={item._id} className="group relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600/20 to-emerald-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                        <div className="relative bg-gray-900/70 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50 hover:border-cyan-500/30 transition-all duration-300">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-cyan-900/30 to-cyan-900/10 text-cyan-300 mb-2">
                                {formatDate(item.createdAt)}
                              </span>
                              <p className="text-xs text-gray-400">{formatTime(item.createdAt)}</p>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => navigate(`/updateWorkout/${item._id}`)}
                                className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                                title="Edit Workout"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                              </button>
                              <button
                                onClick={() => {
                                  deleteWorkout(item._id);
                                }}
                                className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-red-400 transition-colors duration-200"
                                title="Delete Workout"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                              </button>
                            </div>
                          </div>

                          <h3 className="text-xl font-bold text-white mb-4 truncate">
                            {item.exerciseName}
                          </h3>

                          <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="text-center">
                              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                {item.sets}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">Sets</div>
                            </div>
                            <div className="text-center">
                              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                                {item.reps}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">Reps</div>
                            </div>
                            <div className="text-center">
                              <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                                {item.weight || 0}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">Kg</div>
                            </div>
                          </div>

                          <div className="mt-4">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                              <span>Intensity</span>
                              <span>{Math.round((item.weight || 0) * item.sets * item.reps / 100)}%</span>
                            </div>
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                                style={{ width: `${Math.min(100, (item.weight || 0) * item.sets * item.reps / 10)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-white mb-1">Showing {filteredWorkouts.length} workouts</h3>
                        <p className="text-sm text-gray-400">
                          Filtered by: <span className="text-cyan-400">{filter.charAt(0).toUpperCase() + filter.slice(1)}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Total Volume</p>
                        <p className="text-2xl font-bold text-white">
                          {filteredWorkouts.reduce((sum, item) => sum + (item.weight || 0) * item.sets * item.reps, 0)} kg
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Workout;