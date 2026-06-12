const Question = require("../models/Feedback360Question");
require("../models/Feedback360QuestionSection");

exports.getQuestionsByRole = async(req,res)=>{
  try {
    const {role} = req.params;
    const questions = await Question.find({role}).populate('section').sort({section:1,order:1});
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addQuestion = async (req, res) => {
  try {
    const { section, role, type, question, order } = req.body;
    const newQuestion = new Question({ section, role, type, question, order });
    await newQuestion.save();
    res.status(201).json({ message: "Question added successfully", data: newQuestion });
  } catch (error) {
    res.status(500).json({ message: "Error adding question", error: error.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { section, role, type, question, order } = req.body;
    const updatedQuestion = await Question.findByIdAndUpdate(id, { section, role, type, question, order }, { new: true });
    if (!updatedQuestion) return res.status(404).json({ message: "Question not found" });
    res.json({ message: "Question updated successfully", data: updatedQuestion });
  } catch (error) {
    res.status(500).json({ message: "Error updating question", error: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuestion = await Question.findByIdAndDelete(id);
    if (!deletedQuestion) return res.status(404).json({ message: "Question not found" });
    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting question", error: error.message });
  }
};