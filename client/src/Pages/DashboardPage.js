import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import BodyPartChart from "../components/BodyPartChart";
import WorkoutCalendar from "../components/WorkoutCalendar";

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [recentSession, setRecentSession] = useState(null);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [streak, setStreak] = useState(0);
  const [visualData, setVisualData] = useState({
    muscleGroupData: {},
    workoutDates: [],
  });
  const [loading, setLoading] = useState(true);

  // Define the API URL from the environment variable
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

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

        const [sessionsRes, plansRes, statsRes, visualsRes] = await Promise.all(
          [
            axios.get(`${API_URL}/api/sessions`, config),
            axios.get(`${API_URL}/api/workouts`, config),
            axios.get(`${API_URL}/api/users/stats`, config),
            axios.get(`${API_URL}/api/users/dashboard/visuals`, config),
          ]
        );

        if (sessionsRes.data.length > 0) setRecentSession(sessionsRes.data[0]);
        setWorkoutPlans(plansRes.data);
        setStreak(statsRes.data.streak);
        setVisualData(visualsRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [API_URL]);

  const cardClasses = "bg-bg-paper rounded-lg shadow-lg p-6 flex flex-col";

  if (loading) return <p className="text-center mt-8">Loading Dashboard...</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-text-primary">
        Welcome back, {user ? user.name : "Athlete"}!
      </h1>

      {/* --- Top Row: Stats (Fixed Height) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className={`${cardClasses} items-center text-center justify-center h-48 md:h-full`}
        >
          <h2 className="text-xl font-bold mb-2 text-text-primary flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2 text-primary"
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
          <p className="text-6xl font-bold my-2 text-primary">{streak}</p>
          <p className="text-text-secondary">
            {streak === 1 ? "Day" : "Days"} in a row!
          </p>
        </div>
        <div className={`${cardClasses} md:col-span-2 h-48 md:h-full`}>
          <h2 className="text-xl font-bold mb-4 text-text-primary">
            Last Workout
          </h2>
          <div className="flex-grow">
            {recentSession ? (
              <>
                <p className="font-semibold text-text-primary">
                  {recentSession.workoutPlan?.name || "Workout"}
                </p>
                <p className="text-sm text-text-secondary">
                  on {new Date(recentSession.date).toLocaleDateString()}
                </p>
              </>
            ) : (
              <p className="text-text-secondary">
                You haven't logged any workouts yet.
              </p>
            )}
          </div>
          <Link
            to="/history"
            className="text-primary/90 hover:text-primary text-sm font-semibold self-start"
          >
            View Full History →
          </Link>
        </div>
      </div>

      {/* --- Middle Row: Visuals (Fixed Height) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className={`${cardClasses} lg:col-span-2 h-96`}>
          <h2 className="text-xl font-bold mb-4 text-text-primary">
            Body Part Focus
          </h2>
          {Object.keys(visualData.muscleGroupData).length > 0 ? (
            <div className="relative flex-grow">
              <BodyPartChart data={visualData.muscleGroupData} />
            </div>
          ) : (
            <div className="flex-grow flex items-center justify-center">
              <p className="text-center text-text-secondary">
                Log workouts to see your focus areas!
              </p>
            </div>
          )}
        </div>
        <div className={`${cardClasses} lg:col-span-3 h-96`}>
          <h2 className="text-xl font-bold mb-4 text-text-primary">
            Session Calendar
          </h2>
          <div className="flex-grow flex items-center justify-center">
            <WorkoutCalendar workoutDates={visualData.workoutDates} />
          </div>
        </div>
      </div>

      {/* --- Bottom Row: Workout Plans (Variable Height) --- */}
      <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4">
        <div className="container mx-auto h-[85vh] flex flex-col">
          <div className={`${cardClasses} flex-grow`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-text-primary">
                My Workout Plans
              </h2>
              <Link
                to="/create-workout"
                className="text-primary/90 hover:text-primary text-sm font-semibold"
              >
                Create New Plan
              </Link>
            </div>
            <div className="flex-grow overflow-y-auto pr-2">
              {workoutPlans.length > 0 ? (
                <ul className="space-y-3">
                  {workoutPlans.map((plan) => (
                    <li
                      key={plan._id}
                      className="flex justify-between items-center bg-bg-default p-3 rounded-md"
                    >
                      <span className="font-medium text-text-primary">
                        {plan.name}
                      </span>
                      <Link
                        to={`/workout/${plan._id}`}
                        className="px-3 py-1 text-sm font-semibold text-secondary bg-primary rounded-md hover:bg-primary/80"
                      >
                        Start
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-text-secondary">
                  You have no workout plans yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
