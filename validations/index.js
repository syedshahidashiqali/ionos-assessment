const bcrypt = require("bcrypt");

const User = require("../models/User");

exports.userExists = async (email) => {
  try {
    const user = await User.exists({ where: { email: email.toLowerCase() } });
    return !!user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.verifyPassword = async (password_to_comapre, password_base) =>
  await bcrypt.compare(password_to_comapre, password_base);

exports.validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  if (re.test(email)) return email.toLowerCase();
  else return false;
};