const Workout = require("../models/workout.model");

// @desc    Create a new workout
// @route   POST /api/workouts
// @access  Private
const createWorkout = async (req, res) => {
  const { name, description, exercises } = req.body;

  if (!name || exercises.length === 0) {
    return res
      .status(400)
      .json({ message: "Please provide a name and at least one exercise" });
  }

  try {
    const workout = new Workout({
      user: req.user._id, // From our auth middleware
      name,
      description,
      exercises,
    });

    const createdWorkout = await workout.save();
    res.status(201).json(createdWorkout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's workouts
// @route   GET /api/workouts
// @access  Private
const getUserWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user._id });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createWorkout, getUserWorkouts };
