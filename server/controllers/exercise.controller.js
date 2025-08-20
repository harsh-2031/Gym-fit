const Exercise = require("../models/exercise.model");

// @desc    Get all exercises
// @route   GET /api/exercises
// @access  Public
const getAllExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find({});
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getAllExercises };
