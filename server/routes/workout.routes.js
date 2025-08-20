const express = require("express");
const router = express.Router();
const {
  createWorkout,
  getUserWorkouts,
} = require("../controllers/workout.controller");
const { protect } = require("../middleware/auth.middleware");

// We apply the 'protect' middleware to all routes in this file
router.route("/").post(protect, createWorkout).get(protect, getUserWorkouts);

module.exports = router;
