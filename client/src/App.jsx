import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import SignupPage from "./Pages/Signup";
import LoginPage from "./Pages/LoginPage";
import PublicRoute from "./Components/PublicRoute";
import ProtectedRoute from "./Components/ProtectedRoute";
import ProfilePage from "./Pages/ProflePage";
import Workout from "./Pages/Workout";
import Calories from "./Pages/Calories";
import ExerciseForm from "./Pages/AddWorkout";
import UpdateWorkoutPage from "./Pages/UpdateWorkout";
import AddCalories from "./Pages/AddCalories";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />
        <Route
          path="/workout"
          element={
            <Workout />
          }
        />
        <Route
          path="/calories"
          element={
            <Calories />
          }
        />
        <Route
          path="/profile"
          element={
            <ProfilePage />
          }
        />
        <Route
          path="/addWorkout"
          element={
            <ExerciseForm />
          }
        />
        <Route
          path="/updateWorkout/:id"
          element={
            <UpdateWorkoutPage />
          }
        />
        <Route
          path="/addCalories"
          element={
            <AddCalories />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
