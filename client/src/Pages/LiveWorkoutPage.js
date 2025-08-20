import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const LiveWorkoutPage = () => {
  const { id } = useParams(); // Get workout ID from URL
  const navigate = useNavigate();

  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [performedExercises, setPerformedExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkoutPlan = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(
          `http://localhost:5000/api/workouts/${id}`,
          config
        );
        setWorkoutPlan(data);

        // Initialize the state for performed exercises based on the plan
        const initialPerformance = data.exercises.map((ex) => ({
          exercise: ex.exercise._id,
          sets: Array.from({ length: ex.sets }, () => ({
            reps: "",
            weight: "",
          })),
        }));
        setPerformedExercises(initialPerformance);

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch workout plan", error);
        setLoading(false);
      }
    };

    fetchWorkoutPlan();
  }, [id]);

  const handleSetChange = (exerciseIndex, setIndex, field, value) => {
    const updatedPerformance = [...performedExercises];
    updatedPerformance[exerciseIndex].sets[setIndex][field] = value;
    setPerformedExercises(updatedPerformance);
  };

  const handleFinishWorkout = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const sessionData = {
        workoutPlan: id,
        performedExercises: performedExercises.map((ex) => ({
          ...ex,
          sets: ex.sets.filter((set) => set.reps && set.weight), // Only include completed sets
        })),
      };

      await axios.post(
        "http://localhost:5000/api/sessions",
        sessionData,
        config
      );
      alert("Workout session saved successfully!");
      navigate("/workouts"); // Redirect back to the list of workout plans
    } catch (error) {
      console.error("Failed to save workout session", error);
      alert("Failed to save session.");
    }
  };

  if (loading) return <p>Loading workout...</p>;
  if (!workoutPlan) return <p>Workout not found.</p>;

  return (
    <div>
      <h1>{workoutPlan.name}</h1>
      <p>{workoutPlan.description}</p>

      {workoutPlan.exercises.map((exerciseDetail, exerciseIndex) => (
        <div
          key={exerciseDetail.exercise._id}
          style={{
            margin: "20px 0",
            border: "1px solid black",
            padding: "10px",
          }}
        >
          <h3>{exerciseDetail.exercise.name}</h3>
          <p>
            Target: {exerciseDetail.sets} sets of {exerciseDetail.reps} reps
          </p>

          {Array.from({ length: exerciseDetail.sets }).map((_, setIndex) => (
            <div key={setIndex}>
              Set {setIndex + 1}:
              <input
                type="number"
                placeholder="Reps"
                value={
                  performedExercises[exerciseIndex]?.sets[setIndex]?.reps || ""
                }
                onChange={(e) =>
                  handleSetChange(
                    exerciseIndex,
                    setIndex,
                    "reps",
                    e.target.value
                  )
                }
                style={{ margin: "0 5px" }}
              />
              <input
                type="number"
                placeholder="Weight (kg)"
                value={
                  performedExercises[exerciseIndex]?.sets[setIndex]?.weight ||
                  ""
                }
                onChange={(e) =>
                  handleSetChange(
                    exerciseIndex,
                    setIndex,
                    "weight",
                    e.target.value
                  )
                }
                style={{ margin: "0 5px" }}
              />
            </div>
          ))}
        </div>
      ))}

      <button
        onClick={handleFinishWorkout}
        style={{ marginTop: "20px", padding: "10px 20px" }}
      >
        Finish & Save Workout
      </button>
    </div>
  );
};

export default LiveWorkoutPage;
