import React from "react";
import { Link } from "react-router-dom";

// --- MUI Imports ---
import { Box, Typography, Button, Container, Grid, Paper } from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import GroupIcon from "@mui/icons-material/Group";
import EventNoteIcon from "@mui/icons-material/EventNote";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const FeatureCard = ({ icon, title, description }) => (
  <Grid item xs={12} sm={6} md={3}>
    <Paper
      elevation={4}
      sx={{
        p: 4,
        textAlign: "center",
        height: "100%",
        borderRadius: 3,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: 8,
        },
      }}
    >
      <Box sx={{ color: "secondary.main", mb: 2 }}>{icon}</Box>
      <Typography variant="h6" component="h3" gutterBottom>
        {title}
      </Typography>
      <Typography color="text.secondary">{description}</Typography>
    </Paper>
  </Grid>
);

const HomePage = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Container
        maxWidth="md"
        sx={{ textAlign: "center", py: { xs: 6, sm: 10 } }}
      >
        <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
          Transform Your Fitness Journey
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Track workouts, connect with trainers, and see your progress grow.
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/register"
            color="primary"
          >
            Get Started as an Athlete
          </Button>
          <Button
            variant="outlined"
            size="large"
            component={Link}
            to="/trainer/register"
            color="primary"
          >
            I'm a Trainer
          </Button>
        </Box>
      </Container>

      {/* Features Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #121625, #2d3447)", // pulled from theme
          py: { xs: 8, sm: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h2"
            fontWeight="bold"
            textAlign="center"
            gutterBottom
            color="secondary.main"
          >
            Why Choose Gym-Fit?
          </Typography>
          <Typography
            variant="subtitle1"
            textAlign="center"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto", mb: 6 }}
          >
            Whether you're starting out or a seasoned athlete, Gym-Fit helps you
            track workouts, follow structured plans, and stay motivated.
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            <FeatureCard
              icon={<FitnessCenterIcon fontSize="large" />}
              title="Track Workouts"
              description="Log exercises, sets, and reps with our intuitive tracking system."
            />
            <FeatureCard
              icon={<EventNoteIcon fontSize="large" />}
              title="Personal Plans"
              description="Create workout plans tailored to your goals or get them from a trainer."
            />
            <FeatureCard
              icon={<TrendingUpIcon fontSize="large" />}
              title="Progress History"
              description="Monitor your improvements over time with a detailed workout logbook."
            />
            <FeatureCard
              icon={<GroupIcon fontSize="large" />}
              title="Trainer Connection"
              description="Trainers can manage clients, assign workouts, and track their progress."
            />
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
