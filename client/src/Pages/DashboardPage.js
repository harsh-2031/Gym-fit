import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [recentSession, setRecentSession] = useState(null);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get user from local storage
        const userInfo = JSON.parse(localStorage.getItem("user"));
        setUser(userInfo);

        // Setup auth headers
        const token = localStorage.getItem("token");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        // Fetch sessions and workout plans in parallel
        const [sessionsRes, plansRes] = await Promise.all([
          axios.get("http://localhost:5000/api/sessions", config),
          axios.get("http://localhost:5000/api/workouts", config),
        ]);

        // Set the most recent session
        if (sessionsRes.data.length > 0) {
          setRecentSession(sessionsRes.data[0]); // API sorts by most recent
        }

        // Set workout plans
        setWorkoutPlans(plansRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <p>Loading Dashboard...</p>;
  }

  return (
    <div>
      <h1>Welcome back, {user ? user.name : "Athlete"}!</h1>

      {/* Last Workout Summary Card */}
      <div
        style={{
          border: "1px solid #ddd",
          padding: "15px",
          margin: "20px 0",
          borderRadius: "8px",
        }}
      >
        <h2>Last Workout</h2>
        {recentSession ? (
          <div>
            <p>
              <strong>{recentSession.workoutPlan?.name || "Workout"}</strong> on{" "}
              {new Date(recentSession.date).toLocaleDateString()}
            </p>
            <Link to="/history">View Full History</Link>
          </div>
        ) : (
          <p>You haven't logged any workouts yet. Let's get started!</p>
        )}
      </div>

      {/* Quick Start Workout Plans */}
      <div style={{ marginTop: "20px" }}>
        <h2>My Workout Plans</h2>
        {workoutPlans.length > 0 ? (
          workoutPlans.map((plan) => (
            <div
              key={plan._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
                border: "1px solid #eee",
              }}
            >
              <span>{plan.name}</span>
              <Link to={`/workout/${plan._id}`}>
                <button>Start Workout</button>
              </Link>
            </div>
          ))
        ) : (
          <div>
            <p>You have no workout plans.</p>
            <Link to="/create-workout">Create Your First Plan</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
