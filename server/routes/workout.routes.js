const express = require("express");
const router = express.Router();
// Make sure to import getWorkoutById
const {
  createWorkout,
  getUserWorkouts,
  getWorkoutById,
  deleteWorkout,
  updateWorkout,
} = require("../controllers/workout.controller");
const { protect } = require("../middleware/auth.middleware");

router.route("/").post(protect, createWorkout).get(protect, getUserWorkouts);
router.route("/:id").get(protect, getWorkoutById); // Add this new line
router
  .route("/:id")
  .get(protect, getWorkoutById)
  .delete(protect, deleteWorkout)
  .put(protect, updateWorkout);
module.exports = router;
