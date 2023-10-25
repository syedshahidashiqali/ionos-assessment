const User = require('../models/User');
const { validateEmail } = require("../validations/index");
const { generateHash } = require("../services/generate_hash");
const { generateToken } = require("../services/generate_token");
const { userExists, verifyPassword } = require("../validations/index");
const {
  apiSuccessWithData,
  apiValidationErrors,
  apiError
} = require("../utils/apiHelpers");

// Signup API
exports.signup = async (req, res) => {
  try {
    const {
      userName,
      email,
      password
    } = req.body;

    if (!validateEmail(email)) {
      return res.status(403).json(apiValidationErrors("Email is not valid. Please input the correct email."));
    }

    if (await userExists(email)) {
      return res.status(403).json(apiError(`User with email: '${email}' already exists!`));
    }

    const hashedPassword = await generateHash(password);

    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    return res.status(201).json(apiSuccessWithData("User created successfully", savedUser));
  } catch (error) {
    return res.status(500).json(apiError(error.message));
  }
};

// Login API
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validateEmail(email)) {
      return res.status(403).json(apiValidationErrors("Email is not valid. Please input the correct email."));
    }

    const user = await User.findOne({ email }).lean()

    if (!user) {
      return res.status(401).json({ message: "You are not registered. Please sign up first!" });
    }

    const result = await verifyPassword(password, user.password);

    if (!result) {
      return res.status(401).json({ message: "Your password is incorrect. Please try again!" });
    }

    const token = generateToken(email, user._id, "1h");
    delete user.password

    res.status(200).json(apiSuccessWithData("User Logged in!", { token, user }));

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};