const Workout = require("../models/workout.model");

// @desc    Create a new workout
// @route   POST /api/workouts
// @access  Private
const createWorkout = async (req, res) => {
  const { name, description, exercises } = req.body;

  if (!name || !exercises || exercises.length === 0) {
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

// @desc    Get a single workout by ID
// @route   GET /api/workouts/:id
// @access  Private
const getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id).populate(
      "exercises.exercise"
    );

    if (workout && workout.user.toString() === req.user._id.toString()) {
      res.json(workout);
    } else {
      res.status(404).json({ message: "Workout not found" });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// Export ALL functions in a single object
module.exports = {
  createWorkout,
  getUserWorkouts,
  getWorkoutById,
};
