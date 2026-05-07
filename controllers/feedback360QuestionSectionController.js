const QuestionSection = require("../models/Feedback360QuestionSection");

exports.getQuestionSections = async (req, res) => {
  try {
    const sections = await QuestionSection.find();
    res.json(sections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addQuestionSection = async (req, res) => {
  try {
    const { section } = req.body;
    const newSection = new QuestionSection({ section });
    await newSection.save();
    res.status(201).json({ message: "Question section added successfully", data: newSection });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateQuestionSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { section } = req.body;
    const updatedSection = await QuestionSection.findByIdAndUpdate(id, { section }, { new: true });
    if (!updatedSection) return res.status(404).json({ message: "Question section not found" });
    res.json({ message: "Question section updated successfully", data: updatedSection });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteQuestionSection = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSection = await QuestionSection.findByIdAndDelete(id);
    if (!deletedSection) return res.status(404).json({ message: "Question section not found" });
    res.json({ message: "Question section deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
