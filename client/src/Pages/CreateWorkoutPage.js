import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateWorkoutPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [exercises, setExercises] = useState([]); // List of exercises for the new workout

  const [allExercises, setAllExercises] = useState([]); // All available exercises from DB
  const [selectedExercise, setSelectedExercise] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");

  const navigate = useNavigate();

  // Fetch all available exercises when the component mounts
  useEffect(() => {
    const fetchAllExercises = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/exercises");
        setAllExercises(data);
      } catch (error) {
        console.error("Failed to fetch exercises", error);
      }
    };
    fetchAllExercises();
  }, []);

  // Handler to add an exercise to the current workout plan
  const handleAddExercise = () => {
    if (!selectedExercise || !sets || !reps) {
      alert("Please select an exercise and fill in sets and reps.");
      return;
    }
    const exerciseToAdd = allExercises.find(
      (ex) => ex._id === selectedExercise
    );
    const newExercise = {
      exercise: exerciseToAdd._id,
      name: exerciseToAdd.name, // To display in the list
      sets: parseInt(sets, 10),
      reps,
    };
    setExercises([...exercises, newExercise]);
    // Reset fields
    setSelectedExercise("");
    setSets("");
    setReps("");
  };

  // Handler for the final form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const workoutData = {
        name,
        description,
        exercises: exercises.map(({ exercise, sets, reps }) => ({
          exercise,
          sets,
          reps,
        })),
      };
      await axios.post(
        "http://localhost:5000/api/workouts",
        workoutData,
        config
      );
      navigate("/workouts");
    } catch (error) {
      console.error("Failed to create workout", error);
    }
  };

  return (
    <div>
      <h1>Create New Workout Plan</h1>
      <form onSubmit={handleSubmit}>
        {/* Workout Name and Description */}
        <div>
          <label>Workout Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <hr style={{ margin: "20px 0" }} />

        {/* Section to Add Exercises */}
        <h3>Add Exercises to Your Plan</h3>
        <div>
          <select
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
          >
            <option value="">-- Select an Exercise --</option>
            {allExercises.map((ex) => (
              <option key={ex._id} value={ex._id}>
                {ex.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Sets"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
          />
          <input
            type="text"
            placeholder="Reps (e.g., 8-12)"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
          />
          <button type="button" onClick={handleAddExercise}>
            Add Exercise
          </button>
        </div>

        {/* Display List of Added Exercises */}
        <h4>Current Workout Exercises:</h4>
        <ul>
          {exercises.map((ex, index) => (
            <li key={index}>
              {ex.name} - {ex.sets} sets of {ex.reps} reps
            </li>
          ))}
        </ul>

        <hr style={{ margin: "20px 0" }} />

        <button type="submit">Save Workout Plan</button>
      </form>
    </div>
  );
};

export default CreateWorkoutPage;
