import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// --- MUI Imports ---
import {
  Box,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const TrainerWorkoutsPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const token = localStorage.getItem("trainerToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };
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

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          My Workout Templates
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/trainer/create-workout"
          startIcon={<AddIcon />}
        >
          Create New Template
        </Button>
      </Box>

      <Paper elevation={3}>
        <List>
          {workouts.length > 0 ? (
            workouts.map((workout, index) => (
              <React.Fragment key={workout._id}>
                <ListItem>
                  <ListItemText
                    primary={workout.name}
                    secondary={workout.description || "No description"}
                  />
                </ListItem>
                {index < workouts.length - 1 && <Divider />}
              </React.Fragment>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="You haven't created any workout templates yet." />
            </ListItem>
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default TrainerWorkoutsPage;
