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
            <ProtectedRoute>
              <Workout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calories"
          element={
            <ProtectedRoute>
              <Calories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addWorkout"
          element={
            <ProtectedRoute>
              <ExerciseForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/updateWorkout/:id"
          element={
            <ProtectedRoute>
              <UpdateWorkoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addCalories"
          element={
            <ProtectedRoute>
              <AddCalories />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
