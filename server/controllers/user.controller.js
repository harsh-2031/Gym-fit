const User = require("../models/user.model");
const WorkoutSession = require("../models/workoutSession.model");
const jwt = require("jsonwebtoken");

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getUserStats = async (req, res) => {
  try {
    const sessions = await WorkoutSession.find({ user: req.user._id }).sort({
      date: "desc",
    });
    if (sessions.length === 0) {
      return res.json({ streak: 0 });
    }
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastWorkoutDate = new Date(sessions[0].date);
    lastWorkoutDate.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // If the last workout was today or yesterday, the streak can start.
    if (
      lastWorkoutDate.getTime() === today.getTime() ||
      lastWorkoutDate.getTime() === yesterday.getTime()
    ) {
      streak = 1;
      let lastDate = lastWorkoutDate;

      for (let i = 1; i < sessions.length; i++) {
        const currentDate = new Date(sessions[i].date);
        currentDate.setHours(0, 0, 0, 0);

        const expectedPreviousDate = new Date(lastDate);
        expectedPreviousDate.setDate(lastDate.getDate() - 1);

        if (currentDate.getTime() === expectedPreviousDate.getTime()) {
          streak++;
          lastDate = currentDate;
        } else if (currentDate.getTime() !== lastDate.getTime()) {
          // Break if there's a gap (and it's not the same day)
          break;
        }
      }
    }

    res.json({ streak });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { registerUser, loginUser, getUserStats };
