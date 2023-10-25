const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const { allUsers, getMyProfile } = require("../controllers/user");

router.get("/all", allUsers);
router.get("/me", verifyToken, getMyProfile);

module.exports = router;