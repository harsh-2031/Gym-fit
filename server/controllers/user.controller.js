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
        // --- SEND ONBOARDING STATUS ---
        hasCompletedOnboarding: user.hasCompletedOnboarding,
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
const updateUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.age = req.body.age || user.age;
      user.weight = req.body.weight || user.weight;
      user.height = req.body.height || user.height;
      user.goal = req.body.goal || user.goal;
      user.hasCompletedOnboarding = true;

      const updatedUser = await user.save();
      res.json({
        message: "Details updated successfully",
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          hasCompletedOnboarding: updatedUser.hasCompletedOnboarding,
        },
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const sessions = await WorkoutSession.find({ user: req.user._id });

    // --- STATS CALCULATION ---
    const totalWorkouts = sessions.length;

    const totalHoursTrained =
      sessions.reduce((acc, session) => {
        return acc + (session.duration || 0);
      }, 0) / 60; // Convert minutes to hours

    const totalWeightLifted = sessions.reduce((acc, session) => {
      const sessionWeight = session.performedExercises.reduce(
        (sessionAcc, pe) => {
          const exerciseWeight = pe.sets.reduce((setAcc, set) => {
            return setAcc + set.reps * set.weight;
          }, 0);
          return sessionAcc + exerciseWeight;
        },
        0
      );
      return acc + sessionWeight;
    }, 0);

    res.json({
      profile: user,
      stats: {
        totalWorkouts,
        totalHoursTrained: totalHoursTrained.toFixed(1),
        totalWeightLifted,
      },
    });
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};
const getDashboardVisuals = async (req, res) => {
  try {
    const sessions = await WorkoutSession.find({ user: req.user._id }).populate(
      {
        path: "performedExercises.exercise",
        model: "Exercise",
        select: "name muscleGroup", // We now need the muscleGroup
      }
    );

    // Calculate Body Part Distribution
    const muscleGroupCounts = {};
    sessions.forEach((session) => {
      session.performedExercises.forEach((pe) => {
        const muscle = pe.exercise?.muscleGroup;
        if (muscle) {
          muscleGroupCounts[muscle] =
            (muscleGroupCounts[muscle] || 0) + pe.sets.length;
        }
      });
    });

    // Get unique workout dates for the calendar
    const workoutDates = [
      ...new Set(
        sessions.map((s) => new Date(s.date).toISOString().split("T")[0])
      ),
    ];

    res.json({ muscleGroupData: muscleGroupCounts, workoutDates });
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserStats,
  updateUserDetails,
  getUserProfile,
  getDashboardVisuals, // Add this
};
