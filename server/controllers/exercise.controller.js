const Exercise = require("../models/exercise.model");

// @desc    Get all exercises, with optional filtering by muscleGroup
// @route   GET /api/exercises
// @access  Public
const getAllExercises = async (req, res) => {
  try {
    const { muscleGroup } = req.query; // Check for a muscleGroup query parameter
    const filter = {};

    if (muscleGroup) {
      filter.muscleGroup = muscleGroup; // If it exists, add it to our filter object
    }

    // Pass the filter to the find method. If the filter is empty, it finds all.
    const exercises = await Exercise.find(filter).sort({ name: 1 });

    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getAllExercises };
