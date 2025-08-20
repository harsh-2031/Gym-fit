import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import WorkoutsPage from "./Pages/WorkoutsPage"; // Import the new page
import ProtectedRoute from "./components/ProtectedRoute"; // Import the protector
import "./App.css";

// You can create these simple components for now
const HomePage = () => <h2>Home Page</h2>;
// You will create the CreateWorkoutPage component next
const CreateWorkoutPage = () => <h2>Create New Workout</h2>;

function App() {
  return (
    <Router>
      <nav>
        {/* Add more links as needed */}
        <Link to="/">Home</Link> | <Link to="/login">Login</Link> |{" "}
        <Link to="/register">Register</Link> |{" "}
        <Link to="/workouts">My Workouts</Link>
      </nav>
      <div className="container">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/workouts" element={<WorkoutsPage />} />
            <Route path="/create-workout" element={<CreateWorkoutPage />} />
            {/* Add other protected routes like dashboard, profile etc. here */}
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
