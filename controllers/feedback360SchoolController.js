const School = require("../models/Feedback360School");

exports.getSchools = async (req,res)=>{
 try{
  const schools = await School.find().sort({name:1});
  res.json(schools);
 }catch(err){
  res.status(500).json({error:err.message});
 }
};

exports.addSchool = async (req, res) => {
  try {
    const { name } = req.body;
    const newSchool = new School({ name });
    await newSchool.save();
    res.status(201).json({ message: "School added successfully", school: newSchool });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSchool = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedSchool = await School.findByIdAndUpdate(id, { name }, { new: true });
    if (!updatedSchool) return res.status(404).json({ message: "School not found" });
    res.json({ message: "School updated successfully", school: updatedSchool });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSchool = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSchool = await School.findByIdAndDelete(id);
    if (!deletedSchool) return res.status(404).json({ message: "School not found" });
    res.json({ message: "School deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};