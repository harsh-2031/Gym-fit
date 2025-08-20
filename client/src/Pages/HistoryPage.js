import React, { useState, useEffect } from "react";
import axios from "axios";

// --- MUI Imports ---
import {
  Box,
  Typography,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EventNoteIcon from "@mui/icons-material/EventNote";

const HistoryPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(
          "http://localhost:5000/api/sessions",
          config
        );
        setSessions(data);
      } catch (error) {
        console.error("Failed to fetch workout sessions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
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
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ display: "flex", alignItems: "center" }}
      >
        <EventNoteIcon sx={{ mr: 1, fontSize: "2rem" }} /> Workout History
      </Typography>

      {sessions.length > 0 ? (
        sessions.map((session) => (
          <Accordion key={session._id} sx={{ my: 1 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel-${session._id}-content`}
              id={`panel-${session._id}-header`}
            >
              <Typography sx={{ width: "50%", flexShrink: 0 }}>
                {session.workoutPlan
                  ? session.workoutPlan.name
                  : "Workout Plan"}
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                {new Date(session.date).toLocaleDateString()}
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              {session.duration && (
                <Typography>
                  <strong>Duration:</strong> {session.duration} minutes
                </Typography>
              )}

              {session.notes && (
                <Typography>
                  <strong>Notes:</strong> {session.notes}
                </Typography>
              )}

              {/* --- NEW: Workout Plan Overview --- */}
              {session.workoutPlan && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Workout Overview
                  </Typography>
                  {session.workoutPlan.exercises &&
                  session.workoutPlan.exercises.length > 0 ? (
                    <ul style={{ marginLeft: "1rem" }}>
                      {session.workoutPlan.exercises.map((exercise, idx) => (
                        <li key={idx}>
                          <Typography variant="body2">
                            {exercise.name} – {exercise.sets} sets ×{" "}
                            {exercise.reps} reps
                          </Typography>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No exercises listed for this workout.
                    </Typography>
                  )}
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Typography>You haven't completed any workouts yet.</Typography>
      )}
    </Box>
  );
};

export default HistoryPage;
