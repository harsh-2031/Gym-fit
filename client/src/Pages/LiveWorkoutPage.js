import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// --- MUI Imports ---
import {
  Box,
  Typography,
  Button,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  TextField,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TimerIcon from "@mui/icons-material/Timer";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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
    } else if (!timerActive && duration !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, duration]);

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
    setTimerActive(false); // Stop the timer
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const sessionData = {
        workoutPlan: id,
        duration: Math.floor(duration / 60), // Save duration in minutes
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

  // Function to format seconds into MM:SS
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component={Paper} elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4" component="h1">
          {workoutPlan.name}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 1,
            border: "1px solid #ddd",
            borderRadius: 1,
          }}
        >
          <TimerIcon sx={{ mr: 1 }} />
          <Typography variant="h6">{formatTime(duration)}</Typography>
        </Box>
      </Box>

      {workoutPlan.exercises.map((exerciseDetail, exerciseIndex) => (
        <Accordion
          key={exerciseDetail.exercise._id}
          defaultExpanded={exerciseIndex === 0}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ width: "70%", flexShrink: 0 }}>
              {exerciseDetail.exercise.name}
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              Target: {exerciseDetail.sets} sets of {exerciseDetail.reps} reps
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2} alignItems="center">
              {Array.from({ length: exerciseDetail.sets }).map(
                (_, setIndex) => (
                  <React.Fragment key={setIndex}>
                    <Grid item xs={2} sm={1}>
                      <Typography>Set {setIndex + 1}</Typography>
                    </Grid>
                    <Grid item xs={5} sm={4}>
                      <TextField
                        fullWidth
                        label="Reps"
                        type="number"
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
                      />
                    </Grid>
                    <Grid item xs={5} sm={4}>
                      <TextField
                        fullWidth
                        label="Weight (kg)"
                        type="number"
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
                      />
                    </Grid>
                  </React.Fragment>
                )
              )}
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}

      <Button
        onClick={handleFinishWorkout}
        variant="contained"
        color="primary"
        size="large"
        startIcon={<CheckCircleIcon />}
        sx={{ mt: 4, width: "100%" }}
      >
        Finish & Save Workout
      </Button>
    </Box>
  );
};

export default LiveWorkoutPage;
