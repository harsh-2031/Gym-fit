const mongoose = require("mongoose");

const workoutExerciseSchema = new mongoose.Schema({
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercise",
    required: true,
  },
  sets: { type: Number, required: true },
  reps: { type: String, required: true }, // e.g., "8-12" or "15"
  weight: { type: Number }, // Optional
});

const workoutSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true }, // e.g., "Push Day A"
    description: { type: String },
    exercises: [workoutExerciseSchema],
  },
  { timestamps: true }
);

const Workout = mongoose.model("Workout", workoutSchema);
module.exports = Workout;
