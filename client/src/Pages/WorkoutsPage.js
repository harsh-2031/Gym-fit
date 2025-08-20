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

const WorkoutsPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(
          "http://localhost:5000/api/workouts",
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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

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
          My Workout Plans
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/create-workout"
          startIcon={<AddIcon />}
        >
          Create New Plan
        </Button>
      </Box>

      <Paper elevation={3}>
        <List>
          {workouts.length > 0 ? (
            workouts.map((workout, index) => (
              <React.Fragment key={workout._id}>
                <ListItem
                  secondaryAction={
                    <Button
                      variant="outlined"
                      component={Link}
                      to={`/workout/${workout._id}`}
                    >
                      Start Workout
                    </Button>
                  }
                >
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
              <ListItemText primary="You haven't created any workout plans yet." />
            </ListItem>
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default WorkoutsPage;
