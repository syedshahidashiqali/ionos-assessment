const express = require("express");
const router = express.Router();
const auth = require("./auth");
const user = require("./user");
const labyrinth = require("./labyrinth");

router.use("/auth", auth);
router.use("/users", user);
router.use("/labyrinth", labyrinth);

module.exports = router;