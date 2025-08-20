const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const trainerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    specialization: {
      type: String, // e.g., "Strength Training", "Weight Loss", "Yoga"
      trim: true,
    },
    bio: {
      type: String, // A short biography for their profile
      trim: true,
    },
    clients: [
      {
        // An array to store the IDs of their clients (Users)
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
trainerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords for login
trainerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Trainer = mongoose.model("Trainer", trainerSchema);

module.exports = Trainer;
