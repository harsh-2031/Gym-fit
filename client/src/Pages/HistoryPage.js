import React, { useState, useEffect } from "react";
import axios from "axios";

const HistoryPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(
          "http://localhost:5000/api/sessions",
          config
        );
        setSessions(data);
      } catch (error) {
        console.error("Failed to fetch workout sessions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  if (loading) {
    return <p>Loading history...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold">Workout History</h1>
      </div>

      <div className="space-y-4">
        {sessions.length > 0 ? (
          sessions.map((session) => (
            <details
              key={session._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden group"
            >
              <summary className="flex justify-between items-center p-5 cursor-pointer list-none">
                <div>
                  <h2 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
                    {/* --- FIX #1: Use optional chaining here --- */}
                    {session.workoutPlan?.name || "Deleted Workout Plan"}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(session.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="transform group-open:rotate-180 transition-transform duration-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </summary>

              <div className="px-5 pb-5 border-t border-gray-200 dark:border-gray-700">
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-300 space-y-2">
                  {session.duration && (
                    <p>
                      <strong>Duration:</strong> {session.duration} minutes
                    </p>
                  )}
                  {session.notes && (
                    <p>
                      <strong>Notes:</strong> {session.notes}
                    </p>
                  )}
                </div>

                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Performed Exercises:</h3>
                  <ul className="space-y-3">
                    {session.performedExercises.map((pe) => (
                      <li
                        key={pe._id}
                        className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md"
                      >
                        {/* --- FIX #2: Use optional chaining here --- */}
                        <p className="font-bold">
                          {pe.exercise?.name || "Deleted Exercise"}
                        </p>
                        <ul className="list-disc list-inside mt-1 ml-2 text-sm text-gray-600 dark:text-gray-400">
                          {pe.sets.map((set, setIndex) => (
                            <li key={setIndex}>
                              Set {setIndex + 1}: {set.reps} reps at{" "}
                              {set.weight} kg
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </details>
          ))
        ) : (
          <div className="text-center py-10 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <p className="text-gray-500 dark:text-gray-400">
              You haven't completed any workouts yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
