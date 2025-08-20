const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  muscleGroup: { type: String, required: true },
  equipment: { type: String },
  videoUrl: { type: String }, // Optional link to a demonstration video
});

const Exercise = mongoose.model("Exercise", exerciseSchema);
module.exports = Exercise;
