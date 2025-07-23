const express = require("express");
const router = express.Router();

const requestController = require("../controller/requestController");

router.post("/requests", requestController.createRequest);
router.get("/requests", requestController.getAllRequests);
router.get("/requests/:id", requestController.getRequestById);
router.put("/requests/:id", requestController.updateRequest);
router.delete("/requests/:id", requestController.deleteRequest);




module.exports = router;