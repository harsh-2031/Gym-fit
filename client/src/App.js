import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import theme from "./theme"; // Import your new theme

// --- MUI Imports for Layout & Theme ---
import { ThemeProvider } from "@mui/material/styles";
import { Container, CssBaseline, Box } from "@mui/material";

// --- Component Imports ---
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedTrainerRoute from "./components/ProtectedTrainerRoute";

// --- Page Imports ---
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

function App() {
  return (
    // The ThemeProvider makes the theme available to all components
    <ThemeProvider theme={theme}>
      <Router>
        <CssBaseline />
        <Box
          sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
        >
          <Navbar />

          <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/trainer/register"
                element={<TrainerRegisterPage />}
              />
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
              </Route>
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
