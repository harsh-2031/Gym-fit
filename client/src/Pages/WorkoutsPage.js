import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const WorkoutsPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get(
          "http://localhost:5000/api/workouts",
          config
        );
        setWorkouts(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch workouts", error);
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  if (loading) {
    return <p>Loading workouts...</p>;
  }

  return (
    <div>
      <h1>My Workout Plans</h1>
      <Link to="/create-workout">Create New Workout Plan</Link>
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
              {/* You can add more details or a link to a detailed view here */}
            </div>
          ))
        ) : (
          <p>You haven't created any workout plans yet.</p>
        )}
      </div>
    </div>
  );
};

export default WorkoutsPage;
