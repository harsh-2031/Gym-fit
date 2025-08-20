const express = require("express");
const router = express.Router();
const { getAllExercises } = require("../controllers/exercise.controller");

router.route("/").get(getAllExercises);

module.exports = router;
