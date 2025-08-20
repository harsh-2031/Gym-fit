import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// --- MUI Imports ---
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [recentSession, setRecentSession] = useState(null);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("user"));
        setUser(userInfo);

        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [sessionsRes, plansRes] = await Promise.all([
          axios.get("http://localhost:5000/api/sessions", config),
          axios.get("http://localhost:5000/api/workouts", config),
        ]);

        if (sessionsRes.data.length > 0) {
          setRecentSession(sessionsRes.data[0]);
        }
        setWorkoutPlans(plansRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome back, {user ? user.name : "Athlete"}!
      </Typography>

      <Grid container spacing={3}>
        {/* Last Workout Card */}
        <Grid item xs={12} md={6}>
          {/* --- ADDED sx prop here --- */}
          <Card
            component={Paper}
            elevation={3}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                component="div"
                sx={{ display: "flex", alignItems: "center", mb: 2 }}
              >
                <HistoryIcon sx={{ mr: 1 }} /> Last Workout
              </Typography>
              {recentSession ? (
                <>
                  <Typography variant="body1">
                    <strong>
                      {recentSession.workoutPlan?.name || "Workout"}
                    </strong>
                  </Typography>
                  <Typography color="text.secondary">
                    on {new Date(recentSession.date).toLocaleDateString()}
                  </Typography>
                </>
              ) : (
                <Typography color="text.secondary">
                  You haven't logged any workouts yet. Let's get started!
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button size="small" component={Link} to="/history">
                View Full History
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* My Workout Plans Card */}
        <Grid item xs={12} md={6}>
          {/* --- ADDED sx prop here --- */}
          <Card
            component={Paper}
            elevation={3}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                component="div"
                sx={{ display: "flex", alignItems: "center", mb: 2 }}
              >
                <FitnessCenterIcon sx={{ mr: 1 }} /> My Workout Plans
              </Typography>
              {workoutPlans.length > 0 ? (
                <List dense>
                  {workoutPlans.map((plan) => (
                    <ListItem
                      key={plan._id}
                      secondaryAction={
                        <Button
                          variant="outlined"
                          size="small"
                          component={Link}
                          to={`/workout/${plan._id}`}
                        >
                          Start
                        </Button>
                      }
                    >
                      <ListItemText primary={plan.name} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">
                  You have no workout plans yet.
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button size="small" component={Link} to="/create-workout">
                Create a New Plan
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
