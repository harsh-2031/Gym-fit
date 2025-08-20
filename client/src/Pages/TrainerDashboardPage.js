import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link as RouterLink } from "react-router-dom";

// --- MUI Imports ---
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Alert,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupIcon from "@mui/icons-material/Group";

const TrainerDashboardPage = () => {
  const [clients, setClients] = useState([]);
  const [clientEmail, setClientEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const trainerInfo = JSON.parse(localStorage.getItem("trainer"));

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("trainerToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(
        "http://localhost:5000/api/trainers/clients",
        config
      );
      setClients(data);
    } catch (err) {
      setError("Failed to fetch clients.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleAddClient = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const token = localStorage.getItem("trainerToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(
        "http://localhost:5000/api/trainers/clients",
        { clientEmail },
        config
      );
      setMessage("Client added successfully!");
      setClientEmail("");
      fetchClients();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add client.");
      console.error(err); // helpful for debugging
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box>
      {/* --- HEADER SECTION --- */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Welcome, {trainerInfo ? trainerInfo.name : "Trainer"}!
        </Typography>
        <Button
          variant="contained"
          component={RouterLink}
          to="/trainer/workouts"
        >
          My Workout Templates
        </Button>
      </Box>

      <Grid container spacing={3} alignItems="stretch">
        {/* --- ADD CLIENT CARD --- */}
        <Grid item xs={12} md={5}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardHeader avatar={<PersonAddIcon />} title="Add New Client" />
            <CardContent>
              <Box component="form" onSubmit={handleAddClient}>
                <TextField
                  fullWidth
                  type="email"
                  label="Client's Email Address"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  required
                  sx={{ mb: 2 }}
                />
                <Button type="submit" variant="contained" fullWidth>
                  Add Client
                </Button>
              </Box>
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
              {message && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  {message}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* --- CLIENTS LIST CARD --- */}
        <Grid item xs={12} md={7}>
          <Card
            elevation={3}
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <CardHeader avatar={<GroupIcon />} title="My Clients" />
            <CardContent sx={{ flexGrow: 1, overflow: "auto" }}>
              {clients.length > 0 ? (
                <List>
                  {clients.map((client) => (
                    <ListItem key={client._id} disablePadding>
                      <ListItemButton
                        component={RouterLink}
                        to={`/trainer/client/${client._id}`}
                        sx={{
                          borderRadius: 1,
                          "&:hover": { backgroundColor: "action.hover" },
                        }}
                      >
                        <ListItemText
                          primary={client.name}
                          secondary={client.email}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">
                  You don't have any clients yet.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TrainerDashboardPage;
