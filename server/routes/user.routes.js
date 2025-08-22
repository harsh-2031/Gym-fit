const express = require("express");
const router = express.Router();
// ... (imports remain the same) ...
const {
  registerUser,
  loginUser,
  getUserStats,
  updateUserDetails,
  getUserProfile,
  getDashboardVisuals,
} = require("../controllers/user.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/stats", protect, getUserStats);
router.put("/details", protect, updateUserDetails);
router.get("/profile", protect, getUserProfile);
router.get("/dashboard/visuals", protect, getDashboardVisuals);

module.exports = router;
