import React, { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import Swal from 'sweetalert2';

function Calories() {
  const [profile, setProfile] = useState(null);
  const [calories, setCalories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [totalCalories, setTotalCalories] = useState(0);
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
      console.error("Failed to fetch profile", error.response?.data || error.message);
    }
  }

  async function fetchCalories(userId) {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/meal/${userId}`);
      setCalories(response.data);

      const total = response.data.reduce((sum, meal) => sum + (meal.calories || 0), 0);
      setTotalCalories(total);

    } catch (error) {
      console.error("Failed to fetch calories", error);
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteMeal = async (mealId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "This meal will be permanently deleted!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        background: '#1f2937',
        color: '#fff'
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:3000/meal/${mealId}`);

        const updatedCalories = calories.filter(meal => meal._id !== mealId);
        setCalories(updatedCalories);

        const total = updatedCalories.reduce((sum, meal) => sum + (meal.calories || 0), 0);
        setTotalCalories(total);

        setSelectedMeal(null);

        Swal.fire({
          title: 'Deleted!',
          text: 'Meal has been deleted.',
          icon: 'success',
          background: '#1f2937',
          color: '#fff',
          confirmButtonColor: '#10b981',
          timer: 2000
        });
      }
    } catch (error) {
      console.error("Failed to delete meal", error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete meal. Please try again.',
        icon: 'error',
        background: '#1f2937',
        color: '#fff',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown Date';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';

      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) return 'Today';

      if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const isToday = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isYesterday = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'No time';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const groupMealsByDate = () => {
    const grouped = {};
    calories.forEach(meal => {
      let dateKey;
      try {
        if (meal.date) {
          const date = new Date(meal.date);
          dateKey = date.toISOString().split('T')[0]; 
        } else if (meal.createdAt) {
          const date = new Date(meal.createdAt);
          dateKey = date.toISOString().split('T')[0];
        } else {
          dateKey = 'unknown';
        }
      } catch (e) {
        dateKey = 'unknown';
      }

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(meal);
    });

    return Object.entries(grouped).sort(([dateA], [dateB]) => {
      return new Date(dateB) - new Date(dateA);
    });
  };

  const getMealIcon = (mealType) => {
    switch (mealType?.toLowerCase()) {
      case 'breakfast': return '🍳';
      case 'lunch': return '🥪';
      case 'dinner': return '🍽️';
      case 'snacks': return '🍎';
      default: return '🥗';
    }
  };

  const getMealTypeColor = (mealType) => {
    switch (mealType?.toLowerCase()) {
      case 'breakfast': return 'bg-gradient-to-r from-amber-900/30 to-amber-700/30 border-amber-700/50';
      case 'lunch': return 'bg-gradient-to-r from-emerald-900/30 to-emerald-700/30 border-emerald-700/50';
      case 'dinner': return 'bg-gradient-to-r from-blue-900/30 to-blue-700/30 border-blue-700/50';
      case 'snacks': return 'bg-gradient-to-r from-purple-900/30 to-purple-700/30 border-purple-700/50';
      default: return 'bg-gradient-to-r from-gray-900/30 to-gray-700/30 border-gray-700/50';
    }
  };

  const filteredCalories = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return calories.filter(meal => {
      let mealDate;
      try {
        mealDate = meal.date ? new Date(meal.date) : (meal.createdAt ? new Date(meal.createdAt) : null);
      } catch (e) {
        return false;
      }

      if (!mealDate || isNaN(mealDate.getTime())) return false;

      if (filter === 'today') {
        return mealDate.toDateString() === now.toDateString();
      }
      if (filter === 'week') {
        return mealDate >= weekAgo;
      }
      return true;
    });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile?._id) {
      fetchCalories(profile._id);
    }
  }, [profile]);

  const dailyGoal = 2000;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#040D12] to-[#0a1a1a]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Nutrition Tracker
              </h1>
              <p className="text-gray-400 mt-2">Monitor your calorie intake and eating habits</p>
            </div>

            <button
              onClick={() => navigate("/addCalories")}
              className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 rounded-xl font-semibold text-white flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add New Meal
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-amber-900/30 to-amber-700/30 flex items-center justify-center mr-4">
                  <span className="text-2xl">🔥</span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Calories</p>
                  <p className="text-2xl font-bold text-white">{totalCalories.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-emerald-900/30 to-emerald-700/30 flex items-center justify-center mr-4">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Meals</p>
                  <p className="text-2xl font-bold text-white">{calories.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-cyan-900/30 to-cyan-700/30 flex items-center justify-center mr-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Daily Goal</p>
                  <p className="text-2xl font-bold text-white">{dailyGoal.toLocaleString()} kcal</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-purple-900/30 to-purple-700/30 flex items-center justify-center mr-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Daily Average</p>
                  <p className="text-2xl font-bold text-white">
                    {calories.length > 0 ? Math.round(totalCalories / calories.length) : 0} kcal
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Daily Progress</h3>
              <span className="text-cyan-400 font-bold">
                {Math.round((totalCalories / dailyGoal) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-cyan-500 to-teal-500 h-4 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((totalCalories / dailyGoal) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>0 kcal</span>
              <span>{totalCalories} / {dailyGoal} kcal</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex space-x-4 mb-6">
            {['all', 'today', 'week'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${filter === filterType
                    ? 'bg-gradient-to-r from-cyan-900 to-teal-900 text-white'
                    : 'bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : filteredCalories().length > 0 ? (
          <div className="space-y-8">
            {groupMealsByDate().map(([date, meals]) => (
              <div key={date} className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 border-b border-gray-800">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">{formatDate(date)}</h3>
                    <span className="text-amber-400 font-semibold">
                      {meals.reduce((sum, meal) => sum + (meal.calories || 0), 0)} kcal
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {meals.map((meal) => (
                      <div
                        key={meal._id}
                        className={`rounded-xl p-5 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${getMealTypeColor(meal.mealType)
                          } border`}
                        onClick={() => setSelectedMeal(meal)}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center">
                            <span className="text-3xl mr-4">{getMealIcon(meal.mealType)}</span>
                            <div>
                              <h4 className="text-lg font-bold text-white">{meal.foodName || meal.mealType}</h4>
                              <div className="flex items-center mt-1">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${meal.mealType === 'Breakfast' ? 'bg-amber-900/50 text-amber-300' :
                                    meal.mealType === 'Lunch' ? 'bg-emerald-900/50 text-emerald-300' :
                                      meal.mealType === 'Dinner' ? 'bg-blue-900/50 text-blue-300' :
                                        'bg-purple-900/50 text-purple-300'
                                  }`}>
                                  {meal.mealType}
                                </span>
                                <span className="mx-3 text-gray-500">•</span>
                                <span className="text-sm text-gray-400">{meal.time || 'No time specified'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-2xl font-bold text-amber-400">{meal.calories || 0}</div>
                            <div className="text-xs text-gray-400">kcal</div>
                          </div>
                        </div>

                        {meal.description && (
                          <p className="text-gray-300 text-sm mb-4 line-clamp-2">{meal.description}</p>
                        )}

                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            {formatTime(meal.date || meal.createdAt)}
                          </div>
                          <div className="text-xs px-3 py-1 rounded-full bg-gray-800/50">
                            {meal._id ? meal._id.substring(18, 24) : 'N/A'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-gray-800">
            <div className="text-6xl mb-4">🥗</div>
            <h3 className="text-2xl font-bold text-white mb-2">No meals found</h3>
            <p className="text-gray-400 mb-6">Start tracking your nutrition by adding your first meal!</p>
            <button
              onClick={() => navigate("/addCalories")}
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 rounded-xl font-semibold text-white inline-flex items-center transition-all duration-300 hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add Your First Meal
            </button>
          </div>
        )}
      </main>

      {selectedMeal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-2xl w-full max-w-md border border-gray-800">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <span className="text-4xl mr-4">{getMealIcon(selectedMeal.mealType)}</span>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedMeal.foodName || selectedMeal.mealType}</h3>
                    <div className="flex items-center mt-1">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${selectedMeal.mealType === 'Breakfast' ? 'bg-amber-900/50 text-amber-300' :
                          selectedMeal.mealType === 'Lunch' ? 'bg-emerald-900/50 text-emerald-300' :
                            selectedMeal.mealType === 'Dinner' ? 'bg-blue-900/50 text-blue-300' :
                              'bg-purple-900/50 text-purple-300'
                        }`}>
                        {selectedMeal.mealType}
                      </span>
                      <span className="mx-3 text-gray-500">•</span>
                      <span className="text-gray-400">{selectedMeal.time || 'No time'}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMeal(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center bg-gray-800/50 rounded-xl p-4">
                  <span className="text-gray-300">Calories</span>
                  <span className="text-3xl font-bold text-amber-400">{selectedMeal.calories || 0} kcal</span>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-4">
                  <h4 className="text-gray-300 mb-2">Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Date:</span>
                      <span className="text-white">{formatDate(selectedMeal.date || selectedMeal.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Time:</span>
                      <span className="text-white">{selectedMeal.time || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Food:</span>
                      <span className="text-white">{selectedMeal.foodName || selectedMeal.mealType}</span>
                    </div>
                  </div>
                </div>

                {selectedMeal.description && (
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <h4 className="text-gray-300 mb-2">Notes</h4>
                    <p className="text-gray-300">{selectedMeal.description}</p>
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedMeal(null)}
                  className="flex-1 py-3 rounded-xl bg-gray-800 text-white font-medium hover:bg-gray-700 transition"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDeleteMeal(selectedMeal._id)}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium hover:from-red-700 hover:to-pink-700 transition flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Delete Meal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calories;