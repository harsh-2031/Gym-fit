import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const WorkoutsPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(null); // Holds the ID of the open menu
  const menuRef = useRef(null);

  const fetchWorkouts = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(
        "http://localhost:5000/api/workouts",
        config
      );
      setWorkouts(data);
    } catch (error) {
      console.error("Failed to fetch workouts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  // Effect to close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDeleteWorkout = async (workoutId) => {
    setMenuOpen(null); // Close the menu
    if (window.confirm("Are you sure you want to delete this workout plan?")) {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(
          `http://localhost:5000/api/workouts/${workoutId}`,
          config
        );
        setWorkouts(workouts.filter((workout) => workout._id !== workoutId));
      } catch (error) {
        console.error("Failed to delete workout", error);
        alert("Could not delete workout plan.");
      }
    }
  };

  if (loading) {
    return <p>Loading workouts...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Workout Plans</h1>
        <Link
          to="/create-workout"
          className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700"
        >
          Create New Plan
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {workouts.length > 0 ? (
            workouts.map((workout) => (
              <li
                key={workout._id}
                className="px-6 py-4 flex justify-between items-center"
              >
                <div>
                  <p className="text-lg font-semibold">{workout.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {workout.description || "No description"}
                  </p>
                </div>

                {/* --- ACTION BUTTONS --- */}
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/workout/${workout._id}`}
                    className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  >
                    Start
                  </Link>

                  {/* 3-Dot Menu */}
                  <div
                    className="relative"
                    ref={menuOpen === workout._id ? menuRef : null}
                  >
                    <button
                      onClick={() =>
                        setMenuOpen(
                          menuOpen === workout._id ? null : workout._id
                        )
                      }
                      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>

                    {/* Dropdown Menu Content */}
                    {menuOpen === workout._id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                        <Link
                          to={`/edit-workout/${workout._id}`}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteWorkout(workout._id)}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
              You haven't created any workout plans yet.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default WorkoutsPage;
