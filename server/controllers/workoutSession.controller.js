const WorkoutSession = require("../models/workoutSession.model");

// @desc    Save a completed workout session
// @route   POST /api/sessions
// @access  Private
const saveWorkoutSession = async (req, res) => {
  const { workoutPlan, duration, notes, performedExercises } = req.body;

  if (!workoutPlan || !performedExercises || performedExercises.length === 0) {
    return res.status(400).json({ message: "Missing required session data." });
  }

  try {
    const session = new WorkoutSession({
      user: req.user._id, // From the protect middleware
      workoutPlan,
      duration,
      notes,
      performedExercises,
    });

    const savedSession = await session.save();
    res.status(201).json(savedSession);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get all of a user's workout sessions
// @route   GET /api/sessions
// @access  Private
const getUserSessions = async (req, res) => {
  try {
    const sessions = await WorkoutSession.find({ user: req.user._id })
      .populate("workoutPlan", "name") // Populates the plan name
      // --- THIS IS THE UPDATED PART ---
      .populate({
        path: "performedExercises.exercise", // The path inside the document
        model: "Exercise", // The model to use for populating
        select: "name", // We only need the name of the exercise
      })
      .sort({ date: -1 }); // Sort by most recent

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

module.exports = { saveWorkoutSession, getUserSessions };
