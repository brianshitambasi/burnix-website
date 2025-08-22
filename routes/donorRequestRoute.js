const express = require("express");
const router = express.Router();
const donorRequestController = require("../controller/donorRequestController");
const { auth, authorizeRoles } = require("../middleware/auth");

router.get("/my-requests", auth, authorizeRoles("donor"), donorRequestController.getMyDonationRequests);
router.put("/:id/approve", auth, authorizeRoles("donor"), donorRequestController.approveRequest);
router.put("/:id/reject", auth, authorizeRoles("donor"), donorRequestController.rejectRequest);

module.exports = router;
