import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const HistoryPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
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

  if (sessions.length === 0) {
    return (
      <div>
        <h1>Workout History</h1>
        <p>You haven't completed any workouts yet. Go start one!</p>
        <Link to="/workouts">Go to my Workout Plans</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Workout History</h1>
      <div className="session-list">
        {sessions.map((session) => (
          <div
            key={session._id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              margin: "10px 0",
              borderRadius: "5px",
            }}
          >
            <h3>
              {session.workoutPlan ? session.workoutPlan.name : "Workout Plan"}
            </h3>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(session.date).toLocaleDateString()}
            </p>
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
            {/* Optional: Add a link to a detailed view later */}
            {/* <Link to={`/history/${session._id}`}>View Details</Link> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;
