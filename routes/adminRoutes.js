// routes/adminRoute.js
const express = require("express");
const router = express.Router();
const { auth, authorizeRoles } = require("../middleware/auth");
const { adminDashStats } = require("../controller/adminDash");

// GET /api/admin/dashboard
router.get("/dashboard", auth, authorizeRoles("admin"), adminDashStats);

module.exports = router;
