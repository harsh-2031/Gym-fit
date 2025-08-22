const express = require("express");
const router = express.Router();
const {
  registerTrainer,
  loginTrainer,
  addClient,
  getMyClients,
  getClientById,
  createWorkoutTemplate,
  getWorkoutTemplates,
  deleteWorkoutTemplate,
  assignWorkout,
  updateWorkoutTemplate,
  getWorkoutTemplateById,
  getTrainerStats,
} = require("../controllers/trainer.controller");
const { protectTrainer } = require("../middleware/trainerAuth.middleware");

// --- Public Auth Routes ---
router.post("/register", registerTrainer);
router.post("/login", loginTrainer);

// --- Protected Client Management Routes ---
router
  .route("/clients")
  .post(protectTrainer, addClient)
  .get(protectTrainer, getMyClients);

router.get("/clients/:clientId", protectTrainer, getClientById);
router.post("/clients/:clientId/assign-workout", protectTrainer, assignWorkout);

// --- Protected Workout Template Routes ---
router
  .route("/workouts")
  .post(protectTrainer, createWorkoutTemplate)
  .get(protectTrainer, getWorkoutTemplates);

// --- CORRECTED: Routes for a specific workout template by ID ---
// All methods (GET, PUT, DELETE) for the same path are chained together here.
router
  .route("/workouts/:id")
  .get(protectTrainer, getWorkoutTemplateById)
  .put(protectTrainer, updateWorkoutTemplate)
  .delete(protectTrainer, deleteWorkoutTemplate);
router.get("/profile/stats", protectTrainer, getTrainerStats);

module.exports = router;
