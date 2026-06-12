
const roleService = require("../services/feedback360RoleService");
const Role = require("../models/Feedback360Role");

exports.getEligibleRoles = (req, res) => {
  const { school, department } = req.body;
  const roles = roleService.getEligibleRoles(school, department);
  res.json(roles);
};

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find()
    res.json(roles);
  } catch (error) {
    console.error("Error fetching all roles:", error);
    res.status(500).json({ message: "Error fetching all roles" });
  }
};

exports.addRole = async (req, res) => {
  try {
    const { key, name, mandatory } = req.body;
    const newRole = new Role({ key, name, mandatory });
    await newRole.save();
    res.status(201).json({ message: "Role added successfully", role: newRole });
  } catch (error) {
    res.status(500).json({ message: "Error adding role", error: error.message });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { key, name, mandatory } = req.body;
    const updatedRole = await Role.findByIdAndUpdate(id, { key, name, mandatory }, { new: true });
    if (!updatedRole) return res.status(404).json({ message: "Role not found" });
    res.json({ message: "Role updated successfully", role: updatedRole });
  } catch (error) {
    res.status(500).json({ message: "Error updating role", error: error.message });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRole = await Role.findByIdAndDelete(id);
    if (!deletedRole) return res.status(404).json({ message: "Role not found" });
    res.json({ message: "Role deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting role", error: error.message });
  }
};