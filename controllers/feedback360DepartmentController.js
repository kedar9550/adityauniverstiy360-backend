const Department = require("../models/Feedback360Department");

exports.getDepartments = async (req,res) => {
  try {
    const {schoolId} = req.params;
    const departments = await Department.find({school:schoolId}).sort({name:1});
    res.json(departments);
  } catch(err) {
    res.status(500).json({error:err.message});
  }
};

exports.addDepartment = async (req, res) => {
  try {
    const { name, school } = req.body;
    const newDepartment = new Department({ name, school });
    await newDepartment.save();
    res.status(201).json({ message: "Department added successfully", department: newDepartment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, school } = req.body;
    const updatedDepartment = await Department.findByIdAndUpdate(id, { name, school }, { new: true });
    if (!updatedDepartment) return res.status(404).json({ message: "Department not found" });
    res.json({ message: "Department updated successfully", department: updatedDepartment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDepartment = await Department.findByIdAndDelete(id);
    if (!deletedDepartment) return res.status(404).json({ message: "Department not found" });
    res.json({ message: "Department deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getallDepartments = async (req,res) => {
  try {
    const departments = await Department.find().sort({name:1}); 
    res.json(departments);
  } catch(err) {
    res.status(500).json({error:err.message});
  }
};
