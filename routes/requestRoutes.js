const express = require("express");
const router = express.Router();
const requestController = require("../controller/requestConroller");

// Create a new request
router.post("/requests", requestController.createRequest);
// Get all requests
router.get("/requests", requestController.getRequests);
// Get a single request by ID
router.get("/requests/:id", requestController.getRequestById);
// Update a request by ID
router.put("/requests/:id", requestController.updateRequest);
// Delete a request by ID
router.delete("/requests/:id", requestController.deleteRequest);

module.exports = router;