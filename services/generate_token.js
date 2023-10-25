const jwt = require("jsonwebtoken");

exports.generateToken = (email, userId, expiry) =>
  jwt.sign({ email, userId }, process.env.JWT_SECRET, { expiresIn: expiry });