import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

// --- MUI Imports ---
import {
  Button,
  TextField,
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";

const TrainerRegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { name, email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:5000/api/trainers/register", formData);
      alert("Registration successful! Please log in.");
      navigate("/trainer/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Create a Trainer Account
        </Typography>
        <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={onChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={onChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={onChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Sign Up as Trainer"}
          </Button>
          <Typography variant="body2" align="center">
            Already have a trainer account?{" "}
            <Link to="/trainer/login" style={{ color: "#1976d2" }}>
              Sign In
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default TrainerRegisterPage;
