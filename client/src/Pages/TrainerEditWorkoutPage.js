import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const TrainerEditWorkoutPage = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [exercises, setExercises] = useState([]);
  const [muscleGroupFilter, setMuscleGroupFilter] = useState("");
  const [allExercises, setAllExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- Define the API URL from the environment variable ---
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        const token = localStorage.getItem("trainerToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        // --- UPDATED URL ---
        const { data } = await axios.get(
          `${API_URL}/api/trainers/workouts/${id}`,
          config
        );

        setName(data.name);
        setDescription(data.description || "");
        setExercises(
          data.exercises.map((ex) => ({
            exercise: ex.exercise._id,
            name: ex.exercise.name,
            sets: ex.sets,
            reps: ex.reps,
          }))
        );

        // --- UPDATED URL ---
        const exercisesRes = await axios.get(`${API_URL}/api/exercises`);
        setAllExercises(exercisesRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch workout data", error);
        setLoading(false);
      }
    };
    fetchWorkoutData();
  }, [id, API_URL]);

  useEffect(() => {
    const fetchAllExercises = async () => {
      // --- UPDATED URL ---
      let url = `${API_URL}/api/exercises`;
      if (muscleGroupFilter) {
        url += `?muscleGroup=${muscleGroupFilter}`;
      }
      const { data } = await axios.get(url);
      setAllExercises(data);
    };
    fetchAllExercises();
  }, [muscleGroupFilter, API_URL]);

  const handleAddExercise = () => {
    if (!selectedExercise || !sets || !reps) return;
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

  const handleRemoveExercise = (indexToRemove) => {
    setExercises(exercises.filter((_, index) => index !== indexToRemove));
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
      // --- UPDATED URL ---
      await axios.put(
        `${API_URL}/api/trainers/workouts/${id}`,
        workoutData,
        config
      );
      navigate("/trainer/workouts");
    } catch (error) {
      console.error("Failed to update workout template", error);
    }
  };

  const bodyParts = [
    "Chest",
    "Back",
    "Legs",
    "Shoulders",
    "Biceps",
    "Triceps",
    "Core",
    "Forearms",
  ];
  const inputClasses =
    "w-full px-3 py-2 border border-gray-700 bg-bg-default rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-text-primary";
  const buttonClasses =
    "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-secondary bg-primary hover:bg-primary/80";
  const outlinedButtonClasses =
    "w-full h-full flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-text-secondary bg-bg-paper hover:bg-secondary/20";

  if (loading)
    return <p className="text-center mt-8">Loading template for edit...</p>;

  return (
    <div className="bg-bg-paper shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-text-primary">
        Edit Workout Template
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-text-secondary"
            >
              Template Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={`mt-1 ${inputClasses}`}
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-text-secondary"
            >
              Description (Optional)
            </label>
            <textarea
              id="description"
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`mt-1 ${inputClasses}`}
            />
          </div>
        </div>
        <hr className="border-gray-700" />
        <div>
          <h2 className="text-xl font-semibold mb-4 text-text-primary">
            Edit Exercises
          </h2>
          <div className="mb-4">
            <label
              htmlFor="muscleGroup-filter"
              className="block text-sm font-medium text-text-secondary mb-1"
            >
              Filter by Body Part
            </label>
            <select
              id="muscleGroup-filter"
              value={muscleGroupFilter}
              onChange={(e) => setMuscleGroupFilter(e.target.value)}
              className={inputClasses}
            >
              <option value="">All Body Parts</option>
              {bodyParts.map((part) => (
                <option key={part} value={part}>
                  {part}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-5">
              <select
                id="exercise-select"
                value={selectedExercise}
                onChange={(e) => setSelectedExercise(e.target.value)}
                className={inputClasses}
              >
                <option value="" disabled>
                  -- Select an Exercise --
                </option>
                {allExercises.map((ex) => (
                  <option key={ex._id} value={ex._id}>
                    {ex.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <input
                type="number"
                placeholder="Sets"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                className={inputClasses}
              />
            </div>
            <div className="sm:col-span-3">
              <input
                type="text"
                placeholder="Reps"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className={inputClasses}
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={handleAddExercise}
                className={outlinedButtonClasses}
              >
                Add
              </button>
            </div>
          </div>
        </div>
        {exercises.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              Current Template:
            </h3>
            <ul className="mt-2 space-y-2">
              {exercises.map((ex, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-bg-default p-3 rounded-md"
                >
                  <div>
                    <p className="font-medium text-text-primary">{ex.name}</p>
                    <p className="text-sm text-text-secondary">{`${ex.sets} sets of ${ex.reps} reps`}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveExercise(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div>
          <button type="submit" className={buttonClasses}>
            Update Template
          </button>
        </div>
      </form>
    </div>
  );
};

export default TrainerEditWorkoutPage;
