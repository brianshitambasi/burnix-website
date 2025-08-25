const express = require("express");
const router = express.Router();
const requestController = require("../controller/requestConroller");
const { auth, authorizeRoles } = require("../middleware/auth");

// ========================
// Beneficiary Routes
// ========================
router.post("/", auth, authorizeRoles("beneficiary"), requestController.createRequest);
router.post("/:id/make", auth, authorizeRoles("beneficiary"), requestController.makeRequestForDonation);
router.get("/my", auth, authorizeRoles("beneficiary"), requestController.getMyRequests);
router.put("/:id", auth, authorizeRoles("beneficiary"), requestController.updateRequest);
router.delete("/:id", auth, authorizeRoles("beneficiary"), requestController.deleteRequest);

// ========================
// Donor Routes
// ========================
router.get("/donor/my-requests", auth, authorizeRoles("donor"), requestController.getRequestsForMyDonations);
router.put("/:id/status", auth, authorizeRoles("donor"), requestController.updateRequestStatus);

// ========================
// Admin Routes
// ========================
router.get("/", auth, authorizeRoles("admin"), requestController.getRequests);
router.get("/:id", auth, authorizeRoles("admin"), requestController.getRequestById);

module.exports = router;
