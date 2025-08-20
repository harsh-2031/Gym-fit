const mongoose = require("mongoose");

// This schema defines the structure for a single set
const performedSetSchema = new mongoose.Schema({
  reps: { type: Number, required: true },
  weight: { type: Number, required: true },
});

// This schema defines a single exercise performed during the session
const performedExerciseSchema = new mongoose.Schema({
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercise",
    required: true,
  },
  sets: [performedSetSchema],
});

// This is the main schema for the entire workout session
const workoutSessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    workoutPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workout",
      required: true,
    },
    date: { type: Date, default: Date.now, required: true },
    duration: { type: Number }, // Optional: duration in minutes
    notes: { type: String }, // Optional: user's notes about the session
    performedExercises: [performedExerciseSchema],
  },
  { timestamps: true }
);

const WorkoutSession = mongoose.model("WorkoutSession", workoutSessionSchema);

module.exports = WorkoutSession;
