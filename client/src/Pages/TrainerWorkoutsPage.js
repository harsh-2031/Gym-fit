import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const TrainerWorkoutsPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const token = localStorage.getItem("trainerToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(
          "http://localhost:5000/api/trainers/workouts",
          config
        );
        setWorkouts(data);
      } catch (error) {
        console.error("Failed to fetch workouts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkouts();
  }, []);

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

  const handleDeleteTemplate = async (workoutId) => {
    setMenuOpen(null);
    if (window.confirm("Are you sure you want to delete this template?")) {
      try {
        const token = localStorage.getItem("trainerToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(
          `http://localhost:5000/api/trainers/workouts/${workoutId}`,
          config
        );
        setWorkouts(workouts.filter((w) => w._id !== workoutId));
      } catch (error) {
        console.error("Failed to delete template", error);
        alert("Could not delete template.");
      }
    }
  };

  if (loading)
    return <p className="text-center mt-8">Loading workout templates...</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-text-primary">
          My Workout Templates
        </h1>
        <Link
          to="/trainer/create-workout"
          className="inline-flex items-center px-4 py-2 text-sm font-semibold text-secondary bg-primary rounded-md shadow-sm hover:bg-primary/80"
        >
          Create New Template
        </Link>
      </div>

      <div className="bg-bg-paper rounded-lg shadow-lg">
        <ul className="divide-y divide-gray-700">
          {workouts.length > 0 ? (
            workouts.map((workout) => (
              <li
                key={workout._id}
                className="px-6 py-4 flex justify-between items-center"
              >
                <div>
                  <p className="text-lg font-semibold text-text-primary">
                    {workout.name}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {workout.description || "No description"}
                  </p>
                </div>

                <div
                  className="relative"
                  ref={menuOpen === workout._id ? menuRef : null}
                >
                  <button
                    onClick={() =>
                      setMenuOpen(menuOpen === workout._id ? null : workout._id)
                    }
                    className="p-2 rounded-full text-text-secondary hover:bg-secondary/20"
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

                  {menuOpen === workout._id && (
                    <div className="absolute right-0 mt-2 w-48 bg-bg-paper rounded-md shadow-lg py-1 z-10 border border-gray-700">
                      <Link
                        to={`/trainer/edit-workout/${workout._id}`}
                        className="block px-4 py-2 text-sm text-text-primary hover:bg-secondary/20"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteTemplate(workout._id)}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500 hover:text-white"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))
          ) : (
            <li className="px-6 py-10 text-center text-text-secondary">
              You haven't created any workout templates yet.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TrainerWorkoutsPage;
