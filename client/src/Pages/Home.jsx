import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import { Hero } from "../Components/Hero";

function Home() {
  // State for workout and calorie data
  const [workoutData, setWorkoutData] = useState({
    today: { calories: 420, workoutTime: 45, workouts: 3 },
    week: { calories: 3150, workoutTime: 315, workouts: 21 },
    month: { calories: 12600, workoutTime: 1260, workouts: 84 },
  });

  const [recentWorkouts, setRecentWorkouts] = useState([
    {
      id: 1,
      type: "Running",
      duration: 30,
      calories: 320,
      date: "Today, 8:00 AM",
    },
    {
      id: 2,
      type: "Weight Training",
      duration: 45,
      calories: 280,
      date: "Yesterday, 6:30 PM",
    },
    {
      id: 3,
      type: "Cycling",
      duration: 40,
      calories: 380,
      date: "Nov 28, 7:15 AM",
    },
    {
      id: 4,
      type: "Yoga",
      duration: 25,
      calories: 150,
      date: "Nov 27, 6:00 PM",
    },
  ]);

  const [goals, setGoals] = useState({
    calories: { target: 500, current: 420 },
    workouts: { target: 5, current: 3 },
    activeMinutes: { target: 60, current: 45 },
  });

  const [timeFrame, setTimeFrame] = useState("today");

  // Function to handle adding a new workout
  const addWorkout = () => {
    const newWorkout = {
      id: recentWorkouts.length + 1,
      type: "New Workout",
      duration: 30,
      calories: 250,
      date: "Just now",
    };
    setRecentWorkouts([newWorkout, ...recentWorkouts.slice(0, 3)]);

    // Update today's stats
    setWorkoutData({
      ...workoutData,
      today: {
        calories: workoutData.today.calories + 250,
        workoutTime: workoutData.today.workoutTime + 30,
        workouts: workoutData.today.workouts + 1,
      },
    });
  };

  // Function to calculate goal progress percentage
  const calculateProgress = (current, target) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  return (
    <div className="text-white min-h-screen pt-14 bg-gradient-to-b from-[#040D12] to-[#0a1a1a]">
      <Navbar />
      <Hero />

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white">
            Fitness Overview
          </h2>

          {/* Time frame selector */}
          <div className="flex space-x-4 mb-6">
            {["today", "week", "month"].map((frame) => (
              <button
                key={frame}
                className={`px-4 py-2 rounded-lg font-medium ${
                  timeFrame === frame
                    ? "bg-[#183D3D] text-white"
                    : "bg-gray-800 text-gray-300"
                }`}
                onClick={() => setTimeFrame(frame)}
              >
                {frame.charAt(0).toUpperCase() + frame.slice(1)}
              </button>
            ))}
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-300">
                  Calories Burned
                </h3>
                <div className="p-2 bg-[#183D3D] rounded-lg">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    ></path>
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-white">
                {workoutData[timeFrame].calories.toLocaleString()}
              </p>
              <p className="text-gray-400 mt-2">Total calories burned</p>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-300">
                  Workout Time
                </h3>
                <div className="p-2 bg-[#183D3D] rounded-lg">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-white">
                {workoutData[timeFrame].workoutTime} min
              </p>
              <p className="text-gray-400 mt-2">Total active minutes</p>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-300">
                  Workouts Completed
                </h3>
                <div className="p-2 bg-[#183D3D] rounded-lg">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-white">
                {workoutData[timeFrame].workouts}
              </p>
              <p className="text-gray-400 mt-2">Total workouts</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Workouts Section */}
          <div className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Recent Workouts</h2>
              <button
                onClick={addWorkout}
                className="px-4 py-2 bg-[#183D3D] hover:bg-[#1f4d4d] text-white font-medium rounded-lg transition duration-200 flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                Add Workout
              </button>
            </div>

            <div className="space-y-4">
              {recentWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition duration-200"
                >
                  <div className="flex items-center">
                    <div
                      className={`p-3 rounded-lg ${
                        workout.type === "Running"
                          ? "bg-red-900/30"
                          : workout.type === "Weight Training"
                          ? "bg-blue-900/30"
                          : workout.type === "Cycling"
                          ? "bg-green-900/30"
                          : "bg-purple-900/30"
                      }`}
                    >
                      {workout.type === "Running" && (
                        <svg
                          className="w-6 h-6 text-red-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          ></path>
                        </svg>
                      )}
                      {workout.type === "Weight Training" && (
                        <svg
                          className="w-6 h-6 text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                          ></path>
                        </svg>
                      )}
                      {workout.type === "Cycling" && (
                        <svg
                          className="w-6 h-6 text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                          ></path>
                        </svg>
                      )}
                      {workout.type === "Yoga" && (
                        <svg
                          className="w-6 h-6 text-purple-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          ></path>
                        </svg>
                      )}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-white">
                        {workout.type}
                      </h3>
                      <p className="text-sm text-gray-400">{workout.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">
                      {workout.duration} min
                    </p>
                    <p className="text-sm text-gray-400">
                      {workout.calories} cal
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 py-3 text-center text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-750 rounded-lg transition duration-200">
              View All Workouts
            </button>
          </div>

          {/* Goals Progress Section */}
          <div className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-6">Today's Goals</h2>

            <div className="space-y-6">
              {/* Calories Goal */}
              <div>
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium text-gray-300">Calories Burned</h3>
                  <span className="font-semibold text-white">
                    {goals.calories.current} / {goals.calories.target}
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-teal-500 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${calculateProgress(
                        goals.calories.current,
                        goals.calories.target
                      )}%`,
                    }}
                  ></div>
                </div>
                <p className="text-right text-sm text-gray-400 mt-1">
                  {calculateProgress(
                    goals.calories.current,
                    goals.calories.target
                  )}
                  % completed
                </p>
              </div>

              {/* Workouts Goal */}
              <div>
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium text-gray-300">
                    Workouts Completed
                  </h3>
                  <span className="font-semibold text-white">
                    {goals.workouts.current} / {goals.workouts.target}
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${calculateProgress(
                        goals.workouts.current,
                        goals.workouts.target
                      )}%`,
                    }}
                  ></div>
                </div>
                <p className="text-right text-sm text-gray-400 mt-1">
                  {calculateProgress(
                    goals.workouts.current,
                    goals.workouts.target
                  )}
                  % completed
                </p>
              </div>

              {/* Active Minutes Goal */}
              <div>
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium text-gray-300">Active Minutes</h3>
                  <span className="font-semibold text-white">
                    {goals.activeMinutes.current} / {goals.activeMinutes.target}
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-green-500 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${calculateProgress(
                        goals.activeMinutes.current,
                        goals.activeMinutes.target
                      )}%`,
                    }}
                  ></div>
                </div>
                <p className="text-right text-sm text-gray-400 mt-1">
                  {calculateProgress(
                    goals.activeMinutes.current,
                    goals.activeMinutes.target
                  )}
                  % completed
                </p>
              </div>
            </div>

            {/* Weekly Overview */}
            <div className="mt-10">
              <h3 className="font-bold text-white mb-4">Weekly Activity</h3>
              <div className="flex items-end justify-between h-32">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day, index) => {
                    const height = [40, 65, 80, 60, 90, 70, 50][index];
                    return (
                      <div key={day} className="flex flex-col items-center">
                        <div className="text-xs text-gray-400 mb-2">{day}</div>
                        <div
                          className={`w-8 rounded-t-lg ${
                            index === 3
                              ? "bg-gradient-to-t from-[#183D3D] to-cyan-600"
                              : "bg-gray-700"
                          }`}
                          style={{ height: `${height}%` }}
                        ></div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Section */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-xl">
            <p className="text-gray-400 text-sm">Avg. Heart Rate</p>
            <p className="text-xl font-bold text-white">
              128 <span className="text-sm font-normal text-gray-400">BPM</span>
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-xl">
            <p className="text-gray-400 text-sm">Steps Today</p>
            <p className="text-xl font-bold text-white">8,542</p>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-xl">
            <p className="text-gray-400 text-sm">Sleep Duration</p>
            <p className="text-xl font-bold text-white">
              7.2 <span className="text-sm font-normal text-gray-400">hrs</span>
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-xl">
            <p className="text-gray-400 text-sm">Current Streak</p>
            <p className="text-xl font-bold text-white">
              12 <span className="text-sm font-normal text-gray-400">days</span>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-gray-800 text-center text-gray-500 text-sm">
        <p>
          Fitness Tracker • Stay Active, Stay Healthy •{" "}
          {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

export default Home;
