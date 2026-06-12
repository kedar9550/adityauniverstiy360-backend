const Feedback360Round = require("../models/Feedback360Round");

// Create a new round
exports.createRound = async (req, res) => {
  try {
    console.log("Creating Round with body:", req.body);
    const { academicYear, cycle, startDate, endDate } = req.body;
    const active = req.body.active === true || req.body.active === "true";

    // Auto-calculate round number (Find Max and add 1)
    const lastRound = await Feedback360Round.findOne().sort({ round: -1 });
    const round = lastRound ? (lastRound.round + 1) : 1;
    console.log("Calculated Round NO:", round);

    // If setting active, deactivate all others
    if (active) {
      await Feedback360Round.updateMany({}, { active: false });
    }

    const newRound = new Feedback360Round({
      academicYear,
      cycle,
      round,
      startDate,
      endDate,
      active: active || false
    });

    await newRound.save();
    console.log("Round saved successfully:", newRound._id);
    res.status(201).json({ message: "Round created successfully", round: newRound });
  } catch (error) {
    console.error("Error creating round:", error);
    if (error.code === 11000) {
      return res.status(400).json({ error: "A round for this Academic Year and Cycle already exists." });
    }
    res.status(error.name === 'ValidationError' ? 400 : 500).json({ error: error.message });
  }
};

// Get all rounds
exports.getRounds = async (req, res) => {
  try {
    const rounds = await Feedback360Round.find().sort({ round: -1 });
    res.status(200).json(rounds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get active round
exports.getActiveRound = async (req, res) => {
  try {
    const round = await Feedback360Round.findOne({ active: true });
    if (!round) {
      return res.status(404).json({ message: "No active round found" });
    }
    res.status(200).json(round);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a round
exports.updateRound = async (req, res) => {
  try {
    const { id } = req.params;
    const { academicYear, cycle, round, startDate, endDate } = req.body;
    const active = req.body.active === true || req.body.active === "true";

    // If making active, deactivate all others
    if (active) {
      await Feedback360Round.updateMany({ _id: { $ne: id } }, { active: false });
    }

    const updatedRound = await Feedback360Round.findByIdAndUpdate(
      id,
      { academicYear, cycle, round, startDate, endDate, active },
      { new: true }
    );

    if (!updatedRound) {
      return res.status(404).json({ message: "Round not found" });
    }

    res.status(200).json({ message: "Round updated successfully", round: updatedRound });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a round
exports.deleteRound = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRound = await Feedback360Round.findByIdAndDelete(id);

    if (!deletedRound) {
      return res.status(404).json({ message: "Round not found" });
    }

    res.status(200).json({ message: "Round deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Set a specific round as active
exports.setActiveRound = async (req, res) => {
  try {
    const { id } = req.params;

    // Deactivate all rounds
    await Feedback360Round.updateMany({}, { active: false });

    // Activate the selected round
    const updatedRound = await Feedback360Round.findByIdAndUpdate(
      id,
      { active: true },
      { new: true }
    );

    if (!updatedRound) {
      return res.status(404).json({ message: "Round not found" });
    }

    res.status(200).json({ message: "Round set as active", round: updatedRound });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
