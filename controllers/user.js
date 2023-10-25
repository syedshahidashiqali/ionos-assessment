const User = require("../models/User");
const { apiSuccessWithData, apiError } = require("../utils/apiHelpers");

exports.getMyProfile = async (req, res) => {
  try {
    let email = req.user.email;

    const user = await User.findOne({ email: email }).select("-password");

    res.status(200).json(apiSuccessWithData("My Profile", user));

  } catch (err) {
    res.status(500).json(apiError(err.message));
  }
};

exports.allUsers = async (req, res) => {
  try {

    const users = await User.find({});

    res.status(200).json(apiSuccessWithData("Users", users));

  } catch (err) {
    res.status(500).json(apiError(err.message));
  }
};