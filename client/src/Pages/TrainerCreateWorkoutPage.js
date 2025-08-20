import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TrainerCreateWorkoutPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [exercises, setExercises] = useState([]);

  const [allExercises, setAllExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");

  const navigate = useNavigate();

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
      name: exerciseToAdd.name,
      sets: parseInt(sets, 10),
      reps,
    };
    setExercises([...exercises, newExercise]);
    setSelectedExercise("");
    setSets("");
    setReps("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("trainerToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const workoutData = {
        name,
        description,
        exercises: exercises.map(({ exercise, sets, reps }) => ({
          exercise,
          sets,
          reps,
        })),
      };
      // Post to the new trainer-specific endpoint
      await axios.post(
        "http://localhost:5000/api/trainers/workouts",
        workoutData,
        config
      );
      navigate("/trainer/workouts");
    } catch (error) {
      console.error("Failed to create workout template", error);
    }
  };

  return (
    <div>
      <h1>Create New Workout Template</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Template Name:</label>
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
        <hr />
        <h3>Add Exercises</h3>
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
        <h4>Current Exercises in Template:</h4>
        <ul>
          {exercises.map((ex, index) => (
            <li key={index}>
              {ex.name} - {ex.sets} sets of {ex.reps} reps
            </li>
          ))}
        </ul>
        <hr />
        <button type="submit">Save Template</button>
      </form>
    </div>
  );
};

export default TrainerCreateWorkoutPage;
