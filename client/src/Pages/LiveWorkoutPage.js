import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// A simple SVG icon component for the collapsible section
const ChevronIcon = () => (
  <svg
    className="w-5 h-5 transition-transform duration-200"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const LiveWorkoutPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [performedExercises, setPerformedExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState(0); // Workout timer in seconds
  const [timerActive, setTimerActive] = useState(true);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (timerActive) {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  // Data fetching effect
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

        const initialPerformance = data.exercises.map((ex) => ({
          exercise: ex.exercise._id,
          sets: Array.from({ length: ex.sets }, () => ({
            reps: "",
            weight: "",
          })),
        }));
        setPerformedExercises(initialPerformance);
      } catch (error) {
        console.error("Failed to fetch workout plan", error);
      } finally {
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
    setTimerActive(false);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const sessionData = {
        workoutPlan: id,
        duration: Math.floor(duration / 60),
        performedExercises: performedExercises.map((ex) => ({
          ...ex,
          sets: ex.sets
            .filter((set) => set.reps && set.weight)
            .map((set) => ({
              reps: Number(set.reps),
              weight: Number(set.weight),
            })),
        })),
      };
      await axios.post(
        "http://localhost:5000/api/sessions",
        sessionData,
        config
      );
      alert("Workout session saved successfully!");
      navigate("/history");
    } catch (error) {
      console.error("Failed to save workout session", error);
      alert("Failed to save session.");
    }
  };

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const inputClasses =
    "w-full px-3 py-2 text-center border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white";
  const buttonClasses =
    "w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

  if (loading || !workoutPlan) {
    return <p>Loading workout...</p>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl sm:text-3xl font-bold">{workoutPlan.name}</h1>
        <div className="flex items-center space-x-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
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
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-xl font-semibold tabular-nums">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {workoutPlan.exercises.map((exerciseDetail, exerciseIndex) => (
          <details
            key={exerciseDetail.exercise._id}
            className="bg-gray-50 dark:bg-gray-900/50 rounded-lg group"
            open={exerciseIndex === 0}
          >
            <summary className="flex justify-between items-center p-4 cursor-pointer list-none">
              <div className="flex-grow">
                <p className="font-semibold">{exerciseDetail.exercise.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Target: {exerciseDetail.sets} sets of {exerciseDetail.reps}{" "}
                  reps
                </p>
              </div>
              <div className="group-open:rotate-180">
                <ChevronIcon />
              </div>
            </summary>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-3">
                {Array.from({ length: exerciseDetail.sets }).map(
                  (_, setIndex) => (
                    <div
                      key={setIndex}
                      className="grid grid-cols-12 gap-2 items-center"
                    >
                      <div className="col-span-3 sm:col-span-2">
                        <p className="font-medium text-sm text-gray-600 dark:text-gray-300">
                          Set {setIndex + 1}
                        </p>
                      </div>
                      <div className="col-span-4 sm:col-span-5">
                        <input
                          type="number"
                          placeholder="Reps"
                          value={
                            performedExercises[exerciseIndex]?.sets[setIndex]
                              ?.reps || ""
                          }
                          onChange={(e) =>
                            handleSetChange(
                              exerciseIndex,
                              setIndex,
                              "reps",
                              e.target.value
                            )
                          }
                          className={inputClasses}
                        />
                      </div>
                      <div className="col-span-5 sm:col-span-5">
                        <input
                          type="number"
                          placeholder="Weight (kg)"
                          value={
                            performedExercises[exerciseIndex]?.sets[setIndex]
                              ?.weight || ""
                          }
                          onChange={(e) =>
                            handleSetChange(
                              exerciseIndex,
                              setIndex,
                              "weight",
                              e.target.value
                            )
                          }
                          className={inputClasses}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </details>
        ))}
      </div>

      <button onClick={handleFinishWorkout} className={`${buttonClasses} mt-6`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Finish & Save Workout
      </button>
    </div>
  );
};

export default LiveWorkoutPage;
