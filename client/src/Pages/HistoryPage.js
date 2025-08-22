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
    return <p className="text-center mt-8">Loading history...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold text-text-primary">
          Workout History
        </h1>
      </div>
      <div className="space-y-4">
        {sessions.length > 0 ? (
          sessions.map((session) => (
            <details
              key={session._id}
              className="bg-bg-paper rounded-lg shadow-lg overflow-hidden group"
            >
              <summary className="flex justify-between items-center p-5 cursor-pointer list-none">
                <div>
                  <h2 className="text-xl font-semibold text-primary">
                    {session.workoutPlan?.name || "Deleted Workout Plan"}
                  </h2>
                  <p className="text-sm text-text-secondary">
                    {new Date(session.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="transform group-open:rotate-180 transition-transform duration-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-text-secondary"
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
              <div className="px-5 pb-5 border-t border-gray-700">
                <div className="mt-4 text-sm text-text-primary space-y-2">
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
                  <h3 className="font-semibold text-text-primary mb-2">
                    Performed Exercises:
                  </h3>
                  <ul className="space-y-3">
                    {session.performedExercises &&
                      session.performedExercises.map((pe) => (
                        <li
                          key={pe._id}
                          className="bg-bg-default p-3 rounded-md"
                        >
                          <p className="font-bold text-text-primary">
                            {pe.exercise?.name || "Deleted Exercise"}
                          </p>
                          <ul className="list-disc list-inside mt-1 ml-2 text-sm text-text-secondary">
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
          <div className="text-center py-10 px-6 bg-bg-paper rounded-lg shadow-lg">
            <p className="text-text-secondary">
              You haven't completed any workouts yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
