import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateWorkoutPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [exercises, setExercises] = useState([]);

  // --- NEW STATE FOR FILTER ---
  const [muscleGroupFilter, setMuscleGroupFilter] = useState("");
  const [allExercises, setAllExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");

  const navigate = useNavigate();
  const token =
    localStorage.getItem("token") || localStorage.getItem("trainerToken");
  const isTrainer = !!localStorage.getItem("trainerToken");

  // --- UPDATED useEffect TO HANDLE FILTERING ---
  useEffect(() => {
    const fetchAllExercises = async () => {
      try {
        let url = "http://localhost:5000/api/exercises";
        if (muscleGroupFilter) {
          url += `?muscleGroup=${muscleGroupFilter}`;
        }
        const { data } = await axios.get(url);
        setAllExercises(data);
      } catch (error) {
        console.error("Failed to fetch exercises", error);
      }
    };
    fetchAllExercises();
  }, [muscleGroupFilter]); // Re-run when the filter changes

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

  const handleRemoveExercise = (indexToRemove) => {
    setExercises(exercises.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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

      const postUrl = isTrainer
        ? "http://localhost:5000/api/trainers/workouts"
        : "http://localhost:5000/api/workouts";

      await axios.post(postUrl, workoutData, config);

      navigate(isTrainer ? "/trainer/workouts" : "/workouts");
    } catch (error) {
      console.error("Failed to create workout", error);
    }
  };

  const bodyParts = [
    "Biceps",
    "Triceps",
    "Back",
    "Chest",
    "Shoulders",
    "Forearms",
    "Legs",
    "Core",
  ];
  const inputClasses =
    "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white";
  const buttonClasses = `w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
    isTrainer
      ? "bg-purple-600 hover:bg-purple-700"
      : "bg-indigo-600 hover:bg-indigo-700"
  }`;
  const outlinedButtonClasses =
    "w-full h-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700";

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Create New Workout {isTrainer ? "Template" : "Plan"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Name
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
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
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
        <hr className="dark:border-gray-600" />
        <div>
          <h2 className="text-xl font-semibold mb-4">Add Exercises</h2>
          <div className="mb-4">
            <label
              htmlFor="muscleGroup-filter"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
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
                id="sets"
                placeholder="Sets"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                className={inputClasses}
              />
            </div>
            <div className="sm:col-span-3">
              <input
                type="text"
                id="reps"
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
            <h3 className="text-lg font-semibold">Current Plan:</h3>
            <ul className="mt-2 space-y-2">
              {exercises.map((ex, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-md"
                >
                  <div>
                    <p className="font-medium">{ex.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{`${ex.sets} sets of ${ex.reps} reps`}</p>
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
            Save {isTrainer ? "Template" : "Plan"}
          </button>
        </div>
      </form>
    </div>
  );
};
export default CreateWorkoutPage;
