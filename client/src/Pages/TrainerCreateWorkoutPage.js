import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// --- MUI Imports ---
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";

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
    if (!selectedExercise || !sets || !reps) return;
    const exerciseToAdd = allExercises.find(
      (ex) => ex._id === selectedExercise
    );
    const newExercise = {
      exercise: exerciseToAdd._id,
      name: exerciseToAdd.name,
      sets: parseInt(sets),
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
    <Box component={Paper} elevation={3} sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Workout Template
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Template Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description (Optional)"
              multiline
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Add Exercises</Typography>
          </Grid>
          <Grid item xs={12} sm={5}>
            <FormControl fullWidth>
              <InputLabel id="exercise-select-label">Exercise</InputLabel>
              <Select
                labelId="exercise-select-label"
                value={selectedExercise}
                label="Exercise"
                onChange={(e) => setSelectedExercise(e.target.value)}
              >
                {allExercises.map((ex) => (
                  <MenuItem key={ex._id} value={ex._id}>
                    {ex.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={2}>
            <TextField
              fullWidth
              label="Sets"
              type="number"
              value={sets}
              onChange={(e) => setSets(e.target.value)}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              label="Reps"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<AddCircleOutlineIcon />}
              onClick={handleAddExercise}
              sx={{ height: "100%" }}
            >
              Add
            </Button>
          </Grid>
          {exercises.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Current Template:
              </Typography>
              <List dense>
                {exercises.map((ex, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={() => handleRemoveExercise(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={ex.name}
                      secondary={`${ex.sets} sets of ${ex.reps} reps`}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          )}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              size="large"
              fullWidth
            >
              Save Template
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default TrainerCreateWorkoutPage;
