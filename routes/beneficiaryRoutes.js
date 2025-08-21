const express = require("express");
const router = express.Router();
const beneficiaryController = require("../controller/beneficiaryController");

// CRUD Routes
router.post("/", beneficiaryController.createBeneficiary);
router.get("/", beneficiaryController.getBeneficiaries);
router.get("/:id", beneficiaryController.getBeneficiaryById);
router.put("/:id", beneficiaryController.updateBeneficiary);
router.delete("/:id", beneficiaryController.deleteBeneficiary);

module.exports = router;
