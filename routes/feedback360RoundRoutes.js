const express = require("express");
const router = express.Router();
const roundController = require("../controllers/feedback360RoundController");

// Create a round
router.post("/", roundController.createRound);

// Get all rounds
router.get("/", roundController.getRounds);

// Get active round
router.get("/active", roundController.getActiveRound);

// Update a round
router.put("/:id", roundController.updateRound);

// Set round as active
router.put("/:id/activate", roundController.setActiveRound);

// Delete a round
router.delete("/:id", roundController.deleteRound);

module.exports = router;
