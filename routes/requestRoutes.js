const express = require("express");
const router = express.Router();
const requestController = require("../controller/requestConroller");
const { auth, authorizeRoles } = require("../middleware/auth");

// Beneficiary creates request (generic)
router.post("/", auth, authorizeRoles("beneficiary"), requestController.createRequest);

// Beneficiary makes request for a specific donation
router.post("/:id", auth, authorizeRoles("beneficiary"), requestController.makeRequestForDonation);

// Get all requests
router.get("/", requestController.getRequests);

// Get single request
router.get("/:id", requestController.getRequestById);

// Update request (beneficiary only)
router.put("/:id", auth, authorizeRoles("beneficiary"), requestController.updateRequest);

// Delete request (beneficiary only)
router.delete("/:id", auth, authorizeRoles("beneficiary"), requestController.deleteRequest);

module.exports = router;
