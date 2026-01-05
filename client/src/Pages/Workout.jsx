import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ExerciseCard from "../Components/Cards";

function Workout() {
  const [profile, setProfile] = useState(null);
  const [workout, setWorkout] = useState([]);
  const [loading, setLoading] = useState(true);

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
      fetchWorkout(profile._id);
    } catch (error) {
      console.log(error);
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  async function fetchWorkout(userId) {
    try {
      setLoading(true);

      const response = await axios.get(
        `http://localhost:3000/workout/${userId}`
      );

      setWorkout(response.data);
    } catch (error) {
      console.error(
        "Failed to fetch workouts",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  }

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
        <div className="mt-20 text-center text-lg">Loading...</div>
      </>
    );
  }
  if (workout.length === 0) {
    return (
      <>
        <Navbar />
        <h1>Add Workout</h1>
        <button
          onClick={() => navigate("/addWorkout")}
          className="rounded-md bg-blue-600 px-6 py-3 mt-9 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
        >
          Add Workout
        </button>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="mt-16 px-6">
        <button
          onClick={() => navigate("/addWorkout")}
          className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
        >
          Add Workout
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {workout.length === 0 ? (
            <p>No workouts added yet.</p>
          ) : (
            workout.map((item) => (
              <ExerciseCard
                key={item._id}
                name={item.exerciseName}
                sets={item.sets}
                reps={item.reps}
                weight={item.weight}
                onDelete={() => {
                  deleteWorkout(item._id);
                }}
                onEdit={() => {
                  navigate(`/updateWorkout/${item._id}`);
                }}
                date={formatDate(item.createdAt)}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Workout;
