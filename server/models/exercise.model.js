const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  // Add unique: true to the name property
  name: { type: String, required: true, trim: true, unique: true },
  description: { type: String }, // Description is optional
  muscleGroup: { type: String, required: true },
});

const Exercise = mongoose.model("Exercise", exerciseSchema);
module.exports = Exercise;
