import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

// Import all pages
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import DashboardPage from "./Pages/DashboardPage";
import WorkoutsPage from "./Pages/WorkoutsPage";
import CreateWorkoutPage from "./Pages/CreateWorkoutPage";
import LiveWorkoutPage from "./Pages/LiveWorkoutPage";
import HistoryPage from "./Pages/HistoryPage";
import TrainerRegisterPage from "./Pages/TrainerRegisterPage";
import TrainerLoginPage from "./Pages/TrainerLoginPage";
import TrainerDashboardPage from "./Pages/TrainerDashboardPage";
import TrainerWorkoutsPage from "./Pages/TrainerWorkoutsPage";
import TrainerCreateWorkoutPage from "./Pages/TrainerCreateWorkoutPage";
import ClientDetailsPage from "./Pages/ClientDetailsPage";
// Import utility components
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedTrainerRoute from "./components/ProtectedTrainerRoute";
import "./App.css";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> | <Link to="/login">User Login</Link> |{" "}
        <Link to="/trainer/login">Trainer Login</Link>
      </nav>
      <div className="container">
        {/* --- ALL ROUTES GO INSIDE THIS SINGLE <Routes> COMPONENT --- */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/trainer/register" element={<TrainerRegisterPage />} />
          <Route path="/trainer/login" element={<TrainerLoginPage />} />

          {/* Protected Athlete Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/workouts" element={<WorkoutsPage />} />
            <Route path="/create-workout" element={<CreateWorkoutPage />} />
            <Route path="/workout/:id" element={<LiveWorkoutPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Route>

          {/* Protected Trainer Routes */}
          <Route element={<ProtectedTrainerRoute />}>
            <Route
              path="/trainer/dashboard"
              element={<TrainerDashboardPage />}
            />
            <Route path="/trainer/workouts" element={<TrainerWorkoutsPage />} />
            <Route
              path="/trainer/create-workout"
              element={<TrainerCreateWorkoutPage />}
            />
            {/* ADD THIS NEW DYNAMIC ROUTE */}
            <Route
              path="/trainer/client/:clientId"
              element={<ClientDetailsPage />}
            />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
