const Assignment = require("../models/Feedback360RoleAssignment");

// Create or Update an assignment
exports.createOrUpdateAssignment = async (req, res) => {
    try {
        const { role, school, department, name, empId, designation, active, id } = req.body;

        if (id) {
            // Update
            const updated = await Assignment.findByIdAndUpdate(
                id,
                { role, school: school || null, department: department || null, name, empId, designation, active },
                { new: true }
            );
            return res.json({ message: "Assignment updated successfully", assignment: updated });
        }

        // Create
        const newAssignment = new Assignment({
            role,
            school: school || null,
            department: department || null,
            name,
            empId,
            designation,
            active: active !== undefined ? active : true
        });

        await newAssignment.save();
        res.status(201).json({ message: "Assignment created successfully", assignment: newAssignment });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all assignments (with population)
exports.getAllAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find()
            .populate("role", "name key")
            .populate("school", "name code")
            .populate("department", "name code");
        
        res.json(assignments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete assignment
exports.deleteAssignment = async (req, res) => {
    try {
        const { id } = req.params;
        await Assignment.findByIdAndDelete(id);
        res.json({ message: "Assignment deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
