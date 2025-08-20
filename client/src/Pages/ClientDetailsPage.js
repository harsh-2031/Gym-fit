import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

// --- MUI Imports ---
import {
  Box,
  Typography,
  Grid,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AssignmentIcon from "@mui/icons-material/Assignment";

const ClientDetailsPage = () => {
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("trainerToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [clientRes, templatesRes] = await Promise.all([
          axios.get(
            `http://localhost:5000/api/trainers/clients/${clientId}`,
            config
          ),
          axios.get("http://localhost:5000/api/trainers/workouts", config),
        ]);

        setClient(clientRes.data);
        setTemplates(templatesRes.data);
      } catch (err) {
        setError("Failed to load page data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [clientId]);

  const handleAssignWorkout = async (e) => {
    e.preventDefault();
    if (!selectedTemplate) {
      setError("Please select a workout template to assign.");
      return;
    }
    setMessage("");
    setError("");
    try {
      const token = localStorage.getItem("trainerToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const body = { workoutId: selectedTemplate };

      await axios.post(
        `http://localhost:5000/api/trainers/clients/${clientId}/assign-workout`,
        body,
        config
      );
      setMessage("Workout assigned successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to assign workout.");
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  if (error && !client) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Client Management
      </Typography>
      <Grid container spacing={3}>
        {/* Client Information Card */}
        <Grid item xs={12} md={5}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <AccountCircleIcon
              sx={{ fontSize: 80, mb: 2, color: "primary.main" }}
            />
            <Typography variant="h5" component="h2">
              {client?.name}
            </Typography>
            <Typography color="text.secondary">{client?.email}</Typography>
          </Paper>
        </Grid>

        {/* Assign Workout Card */}
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography
              variant="h6"
              component="h3"
              gutterBottom
              sx={{ display: "flex", alignItems: "center" }}
            >
              <AssignmentIcon sx={{ mr: 1 }} /> Assign a New Workout
            </Typography>
            <Box component="form" onSubmit={handleAssignWorkout}>
              <FormControl fullWidth sx={{ my: 2 }}>
                <InputLabel id="template-select-label">
                  Select a Template
                </InputLabel>
                <Select
                  labelId="template-select-label"
                  value={selectedTemplate}
                  label="Select a Template"
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  required
                >
                  {templates.length > 0 ? (
                    templates.map((template) => (
                      <MenuItem key={template._id} value={template._id}>
                        {template.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No templates available</MenuItem>
                  )}
                </Select>
              </FormControl>
              <Button type="submit" variant="contained" fullWidth>
                Assign Workout
              </Button>
            </Box>
            {message && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {message}
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ClientDetailsPage;
