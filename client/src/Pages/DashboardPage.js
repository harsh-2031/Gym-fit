import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [recentSession, setRecentSession] = useState(null);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("user"));
        setUser(userInfo);
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // --- MODIFIED: Fetching data separately for resilience ---

        // Fetch Sessions
        try {
          const sessionsRes = await axios.get(
            "http://localhost:5000/api/sessions",
            config
          );
          if (sessionsRes.data.length > 0) {
            setRecentSession(sessionsRes.data[0]);
          }
        } catch (err) {
          console.error("Could not fetch sessions", err);
        }

        // Fetch Workout Plans
        try {
          const plansRes = await axios.get(
            "http://localhost:5000/api/workouts",
            config
          );
          setWorkoutPlans(plansRes.data);
        } catch (err) {
          console.error("Could not fetch workout plans", err);
        }

        // Fetch Stats (Streak)
        try {
          const statsRes = await axios.get(
            "http://localhost:5000/api/users/stats",
            config
          );
          setStreak(statsRes.data.streak);
        } catch (err) {
          console.error("Could not fetch stats", err);
        }
      } catch (error) {
        console.error("An error occurred in the dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const cardClasses =
    "bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col";

  if (loading) {
    return <p className="text-center mt-8">Loading Dashboard...</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Welcome back, {user ? user.name : "Athlete"}!
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Streak Card */}
        <div
          className={`${cardClasses} items-center justify-center text-center`}
        >
          <h2 className="text-xl font-bold mb-2 flex items-center text-gray-800 dark:text-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2 text-orange-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.657 7.343A8 8 0 0117.657 18.657z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.879 16.121A3 3 0 1012.014 13c-1.121 0-2.134.468-2.829 1.229a3 3 0 00-2.122 2.898z"
              />
            </svg>
            Workout Streak
          </h2>
          <p className="text-6xl font-bold my-2 text-gray-900 dark:text-white">
            {streak}
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            {streak === 1 ? "Day" : "Days"} in a row!
          </p>
        </div>

        {/* Last Workout Card */}
        <div className={`${cardClasses} lg:col-span-2`}>
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            Last Workout
          </h2>
          {recentSession ? (
            <div className="flex-grow">
              <p className="font-semibold text-gray-900 dark:text-white">
                {recentSession.workoutPlan?.name || "Workout"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                on {new Date(recentSession.date).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 flex-grow">
              You haven't logged any workouts yet.
            </p>
          )}
          <Link
            to="/history"
            className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-semibold mt-4 self-start"
          >
            View Full History →
          </Link>
        </div>
      </div>

      {/* Workout Plans Card */}
      <div className={cardClasses}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            My Workout Plans
          </h2>
          <Link
            to="/create-workout"
            className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-semibold"
          >
            Create New Plan
          </Link>
        </div>
        {workoutPlans.length > 0 ? (
          <ul className="space-y-3">
            {workoutPlans.map((plan) => (
              <li
                key={plan._id}
                className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-md"
              >
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {plan.name}
                </span>
                <Link
                  to={`/workout/${plan._id}`}
                  className="px-3 py-1 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Start
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            You have no workout plans yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
