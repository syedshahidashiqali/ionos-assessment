const bcrypt = require("bcrypt");

exports.generateHash = async (string) => await bcrypt.hash(string, 12);