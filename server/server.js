const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// --- 1. REQUIRE all your routes ONCE at the top ---
const userRoutes = require("./routes/user.routes");
const workoutRoutes = require("./routes/workout.routes");
const exerciseRoutes = require("./routes/exercise.routes");
const workoutSessionRoutes = require("./routes/workoutSession.routes");
const trainerRoutes = require("./routes/trainer.routes");

const app = express();
const port = process.env.PORT || 5000;

// --- 2. MIDDLEWARE ---
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// --- 3. DATABASE CONNECTION ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// --- 4. API ROUTES (Use each route ONCE) ---
app.use("/api/users", userRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/sessions", workoutSessionRoutes);
app.use("/api/trainers", trainerRoutes);

// --- 5. START THE SERVER ---
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
