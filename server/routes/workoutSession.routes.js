const express = require("express");
const router = express.Router();
const {
  saveWorkoutSession,
  getUserSessions,
} = require("../controllers/workoutSession.controller");
const { protect } = require("../middleware/auth.middleware");

// Apply the 'protect' middleware to ensure only logged-in users can access these routes
router
  .route("/")
  .post(protect, saveWorkoutSession)
  .get(protect, getUserSessions);

module.exports = router;
