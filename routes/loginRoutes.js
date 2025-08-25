const express = require("express");
const router = express.Router();
const loginController = require("../controller/loginController");

// ========================
// Auth Routes
// ========================
router.post("/register", loginController.registerUser);
router.post("/login", loginController.loginUser);

module.exports = router;
