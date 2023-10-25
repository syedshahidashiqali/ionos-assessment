const express = require("express");
const router = express.Router();
const {
  allLabyrinths,
  getLabyrinthById,
  createLabyrinth,
  setBlockTypeUsingCoordinates,
  setStartingBlockUsingCoordinates,
  setEndingBlockUsingCoordinates,
  solveLabyrinth,
} = require("../controllers/labyrinth");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/", verifyToken, allLabyrinths);
router.get("/:id", verifyToken, getLabyrinthById);
router.post("/", verifyToken, createLabyrinth);
router.put("/:id/playfield/:x/:y/:type", verifyToken, setBlockTypeUsingCoordinates);
router.put("/:id/start/:x/:y", verifyToken, setStartingBlockUsingCoordinates);
router.put("/:id/end/:x/:y", verifyToken, setEndingBlockUsingCoordinates);
router.get("/:id/solution", verifyToken, solveLabyrinth);

module.exports = router; 