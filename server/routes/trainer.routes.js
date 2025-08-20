const express = require("express");
const router = express.Router();
const {
  registerTrainer,
  loginTrainer,
  addClient,
  getMyClients,
  createWorkoutTemplate,
  getWorkoutTemplates,
  assignWorkout,
  getClientById,
} = require("../controllers/trainer.controller");
const { protectTrainer } = require("../middleware/trainerAuth.middleware");

// Public routes
router.post("/register", registerTrainer);
router.post("/login", loginTrainer);

// Protected client management routes
router
  .route("/clients")
  .post(protectTrainer, addClient)
  .get(protectTrainer, getMyClients);

// Protected route for a single client
router.get("/clients/:clientId", protectTrainer, getClientById);

// Protected route for assigning workouts
router.post("/clients/:clientId/assign-workout", protectTrainer, assignWorkout);

// Protected routes for workout templates
router
  .route("/workouts")
  .post(protectTrainer, createWorkoutTemplate)
  .get(protectTrainer, getWorkoutTemplates);

module.exports = router;
