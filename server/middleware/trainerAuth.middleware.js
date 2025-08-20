const jwt = require("jsonwebtoken");
const Trainer = require("../models/trainer.model");

const protectTrainer = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if it's a trainer token
      if (!decoded.isTrainer) {
        return res.status(401).json({ message: "Not authorized" });
      }

      // Get trainer from the token
      req.trainer = await Trainer.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protectTrainer };
