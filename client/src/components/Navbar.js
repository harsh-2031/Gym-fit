import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  // Check login states
  const isUserLoggedIn = !!localStorage.getItem("token");
  const isTrainerLoggedIn = !!localStorage.getItem("trainerToken");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("trainerToken");
    localStorage.removeItem("trainer");
    navigate("/");
    window.location.reload();
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "primary.main",
        borderBottom: "1px solid rgba(184,159,101,0.3)",
        boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
      }}
    >
      <Toolbar>
        {/* Brand / Logo */}
        <Typography
          variant="h5"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
            letterSpacing: 1.2,
          }}
        >
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "#b89f65", // gold brand
            }}
          >
            Gym-Fit
          </Link>
        </Typography>

        {/* Navigation Buttons */}
        {isUserLoggedIn ? (
          <Box>
            <Button
              sx={{
                color: "secondary.light",
                mx: 1,
                "&:hover": { color: "secondary.main", bgcolor: "transparent" },
              }}
              component={Link}
              to="/dashboard"
            >
              Dashboard
            </Button>
            <Button
              sx={{
                color: "secondary.light",
                mx: 1,
                "&:hover": { color: "secondary.main", bgcolor: "transparent" },
              }}
              component={Link}
              to="/workouts"
            >
              My Workouts
            </Button>
            <Button
              sx={{
                color: "secondary.light",
                mx: 1,
                "&:hover": { color: "secondary.main", bgcolor: "transparent" },
              }}
              component={Link}
              to="/history"
            >
              History
            </Button>
            <Button
              sx={{
                color: "#1a1f35",
                bgcolor: "secondary.main",
                mx: 1,
                "&:hover": { bgcolor: "secondary.light" },
              }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        ) : isTrainerLoggedIn ? (
          <Box>
            <Button
              sx={{
                color: "secondary.light",
                mx: 1,
                "&:hover": { color: "secondary.main" },
              }}
              component={Link}
              to="/trainer/dashboard"
            >
              Dashboard
            </Button>
            <Button
              sx={{
                color: "secondary.light",
                mx: 1,
                "&:hover": { color: "secondary.main" },
              }}
              component={Link}
              to="/trainer/workouts"
            >
              Templates
            </Button>
            <Button
              sx={{
                color: "#1a1f35",
                bgcolor: "secondary.main",
                mx: 1,
                "&:hover": { bgcolor: "secondary.light" },
              }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Box>
            <Button
              sx={{
                color: "secondary.light",
                mx: 1,
                "&:hover": { color: "secondary.main" },
              }}
              component={Link}
              to="/login"
            >
              User Login
            </Button>
            <Button
              sx={{
                color: "secondary.light",
                mx: 1,
                "&:hover": { color: "secondary.main" },
              }}
              component={Link}
              to="/trainer/login"
            >
              Trainer Login
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
