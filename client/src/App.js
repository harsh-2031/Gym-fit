import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedTrainerRoute from "./components/ProtectedTrainerRoute";
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

// --- Import the new Edit pages ---
import EditWorkoutPage from "./Pages/EditWorkoutPage";
// Assuming you will create this next for the trainer, as per the pattern
import TrainerEditWorkoutPage from "./Pages/TrainerEditWorkoutPage";

function App() {
  return (
    <Router>
      <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
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
              {/* Add the new edit route */}
              <Route path="/edit-workout/:id" element={<EditWorkoutPage />} />
            </Route>

            {/* Protected Trainer Routes */}
            <Route element={<ProtectedTrainerRoute />}>
              <Route
                path="/trainer/dashboard"
                element={<TrainerDashboardPage />}
              />
              <Route
                path="/trainer/workouts"
                element={<TrainerWorkoutsPage />}
              />
              <Route
                path="/trainer/create-workout"
                element={<TrainerCreateWorkoutPage />}
              />
              <Route
                path="/trainer/client/:clientId"
                element={<ClientDetailsPage />}
              />
              {/* Add the new trainer edit route */}
              <Route
                path="/trainer/edit-workout/:id"
                element={<TrainerEditWorkoutPage />}
              />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
