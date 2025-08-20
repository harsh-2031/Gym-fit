const Trainer = require("../models/trainer.model");
const User = require("../models/user.model");
const Workout = require("../models/workout.model");
const jwt = require("jsonwebtoken");

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id, isTrainer: true }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register a new trainer
// @route   POST /api/trainers/register
const registerTrainer = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const trainerExists = await Trainer.findOne({ email });
    if (trainerExists) {
      return res.status(400).json({ message: "Trainer already exists" });
    }
    const trainer = await Trainer.create({ name, email, password });
    if (trainer) {
      res.status(201).json({
        _id: trainer._id,
        name: trainer.name,
        email: trainer.email,
        token: generateToken(trainer._id),
      });
    } else {
      res.status(400).json({ message: "Invalid trainer data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth trainer & get token
// @route   POST /api/trainers/login
const loginTrainer = async (req, res) => {
  const { email, password } = req.body;
  try {
    const trainer = await Trainer.findOne({ email });
    if (trainer && (await trainer.matchPassword(password))) {
      res.json({
        _id: trainer._id,
        name: trainer.name,
        email: trainer.email,
        token: generateToken(trainer._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a client by email
// @route   POST /api/trainers/clients
const addClient = async (req, res) => {
  const { clientEmail } = req.body;
  try {
    const client = await User.findOne({ email: clientEmail });
    if (!client) {
      return res
        .status(404)
        .json({ message: "User with this email not found." });
    }
    const trainer = await Trainer.findById(req.trainer._id);
    if (trainer.clients.includes(client._id)) {
      return res
        .status(400)
        .json({ message: "This user is already your client." });
    }
    trainer.clients.push(client._id);
    await trainer.save();
    res.status(200).json({ message: "Client added successfully.", trainer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get the trainer's list of clients
// @route   GET /api/trainers/clients
const getMyClients = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.trainer._id).populate(
      "clients",
      "name email"
    );
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found." });
    }
    res.json(trainer.clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a workout template
// @route   POST /api/trainers/workouts
const createWorkoutTemplate = async (req, res) => {
  const { name, description, exercises } = req.body;
  if (!name || !exercises || exercises.length === 0) {
    return res
      .status(400)
      .json({ message: "Template requires a name and at least one exercise" });
  }
  try {
    const workout = new Workout({
      user: req.trainer._id,
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

// @desc    Get trainer's workout templates
// @route   GET /api/trainers/workouts
const getWorkoutTemplates = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.trainer._id });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign a workout to a client
// @route   POST /api/trainers/clients/:clientId/assign-workout
const assignWorkout = async (req, res) => {
  const { clientId } = req.params;
  const { workoutId } = req.body;
  try {
    const trainer = await Trainer.findById(req.trainer._id);
    if (!trainer.clients.includes(clientId)) {
      return res.status(401).json({ message: "This user is not your client." });
    }
    const workoutTemplate = await Workout.findById(workoutId);
    if (!workoutTemplate) {
      return res.status(404).json({ message: "Workout template not found." });
    }
    const newWorkoutForClient = new Workout({
      user: clientId,
      name: workoutTemplate.name,
      description: workoutTemplate.description,
      exercises: workoutTemplate.exercises,
      assignedBy: req.trainer._id,
    });
    await newWorkoutForClient.save();
    res
      .status(201)
      .json({
        message: "Workout assigned successfully.",
        workout: newWorkoutForClient,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single client by ID
// @route   GET /api/trainers/clients/:clientId
const getClientById = async (req, res) => {
  const { clientId } = req.params;
  try {
    const trainer = await Trainer.findById(req.trainer._id);
    if (!trainer.clients.includes(clientId)) {
      return res.status(401).json({ message: "This user is not your client." });
    }
    const client = await User.findById(clientId).select("-password");
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerTrainer,
  loginTrainer,
  addClient,
  getMyClients,
  createWorkoutTemplate,
  getWorkoutTemplates,
  assignWorkout,
  getClientById,
};
