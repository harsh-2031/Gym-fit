import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const TrainerWorkoutsPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        // Use the trainerToken for authentication
        const token = localStorage.getItem("trainerToken");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        // Fetch from the new trainer-specific endpoint
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

  if (loading) return <p>Loading workout templates...</p>;

  return (
    <div>
      <h1>My Workout Templates</h1>
      <Link to="/trainer/create-workout">Create New Template</Link>
      <div>
        {workouts.length > 0 ? (
          workouts.map((workout) => (
            <div
              key={workout._id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                margin: "10px 0",
              }}
            >
              <h2>{workout.name}</h2>
              <p>{workout.description}</p>
              {/* In the future, you could add Edit/Delete buttons here */}
            </div>
          ))
        ) : (
          <p>You haven't created any workout templates yet.</p>
        )}
      </div>
    </div>
  );
};

export default TrainerWorkoutsPage;
