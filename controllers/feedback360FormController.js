const Role = require("../models/Feedback360Role");
const Question = require("../models/Feedback360Question");
const FeedbackRound = require("../models/Feedback360Round");
const FeedbackResponse = require("../models/Feedback360Response");
const School = require("../models/Feedback360School");
const Department = require("../models/Feedback360Department");
const Assignment = require("../models/Feedback360RoleAssignment");
const roleService = require("../services/feedback360RoleService");

exports.getFeedbackForm = async (req, res) => {

  try {

    const { school, department, browserSignature, employeeRole } = req.body;

    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // 1️Check active round
    const activeRound = await FeedbackRound.findOne({ active: true });

    if (!activeRound) {
      return res.status(403).json({ message: "No active feedback round found." });
    }

    const currentDate = new Date();
    const startDate = new Date(activeRound.startDate);
    const endDate = new Date(activeRound.endDate);
    endDate.setHours(23, 59, 59, 999);

    if (currentDate < startDate || currentDate > endDate) {
      return res.status(403).json({
        message: `Feedback forms are only available between ${startDate.toDateString()} and ${endDate.toDateString()}.`
      });
    }

    // 2️ Resolve school & department
    let schoolObj = null;
    let deptObj = null;

    if (school) {
      schoolObj = await School.findOne({ code: school });
    }

    if (department) {
      deptObj = await Department.findOne({ code: department });
    }

    // 3️ Eligible roles
    const roleKeys = roleService.getEligibleRoles(school, department);

    let roles = await Role.find({
      key: { $in: roleKeys }
    });

    if (employeeRole === "HOD") {
      roles = roles.filter(r => r.key !== "hod");
    } else if (employeeRole === "Assoc Dean/Dean") {
      const excludedKeys = [
        "hod",
        "associate_dean_soe",
        "associate_dean_fe",
        "associate_dean_sos",
        "associate_dean_sob",
        "dean_sop"
      ];
      roles = roles.filter(r => !excludedKeys.includes(r.key));
    }

    if (roles.length === 0) {
      return res.status(400).json({
        message: "No eligible roles found for the provided details."
      });
    }

    // 4️ Base query
    const baseQuery = {
      round: activeRound._id
    };

    if (browserSignature) {
      baseQuery.browserSignature = browserSignature;
    } else {
      // Fallback to IP only if no browser signature (though frontend should provide it)
      baseQuery.ipAddress = ipAddress;
    }

    // 5️Separate HOD and other roles
    const hodRole = roles.find(r => r.key === "hod");
    const nonHodRoles = roles
      .filter(r => r.key !== "hod")
      .map(r => r._id);

    let completedRoleIds = [];

    // 6️Check normal roles (single DB call)
    if (nonHodRoles.length > 0) {
      const responses = await FeedbackResponse.find({
        ...baseQuery,
        role: { $in: nonHodRoles }
      }).select("role");

      completedRoleIds.push(...responses.map(r => r.role.toString()));
    }

    // 7 Check HOD role separately
    if (hodRole) {

      const hodQuery = {
        ...baseQuery,
        role: hodRole._id
      };

      if (schoolObj) hodQuery.school = schoolObj._id;
      if (deptObj) hodQuery.department = deptObj._id;

      const hodResponse = await FeedbackResponse.findOne(hodQuery).select("role");

      if (hodResponse) {
        completedRoleIds.push(hodResponse.role.toString());
      }
    }

    // 8️Filter pending roles
    const pendingRoles = roles.filter(
      r => !completedRoleIds.includes(r._id.toString())
    );

    if (pendingRoles.length === 0) {
      return res.status(200).json({
        alreadyCompleted: true,
        message: "You have already submitted feedback for all applicable roles in this round."
      });
    }

    // 10 Fetch active role assignments for pendings
    const pendingRoleIds = pendingRoles.map(r => r._id);
    const assignments = await Assignment.find({
      role: { $in: pendingRoleIds },
      active: true
    });

    // 10.5 Fetch questions for pendings
    const questions = await Question
      .find({ role: { $in: pendingRoleIds } })
      .populate("section")
      .sort({ section: 1, order: 1 });

    // 11 Build response structure with assigned names
    const roleMap = {};

    pendingRoles.forEach(role => {
      // Find matching assignment
      let assignedName = "";
      let empId = "";
      const roleAssignments = assignments.filter(a => a.role.toString() === role._id.toString());

      // 1. Exact match (School & Dept)
      let found = roleAssignments.find(a =>
        a.school?.toString() === schoolObj?._id.toString() &&
        a.department?.toString() === deptObj?._id.toString()
      );

      // 2. School match (for Deans etc)
      if (!found) {
        found = roleAssignments.find(a =>
          a.school?.toString() === schoolObj?._id.toString() &&
          !a.department
        );
      }

      // 3. Global match
      if (!found) {
        found = roleAssignments.find(a => !a.school && !a.department);
      }

      if (found) {
        assignedName = found.name;
        empId = found.empId || "";
      }

      roleMap[role._id] = {
        roleId: role._id,
        key: role.key,
        name: role.name,
        assignedName, // Pass the assigned name
        empId,       // Pass the employee id
        mandatory: employeeRole === "Assoc Dean/Dean" ? false : role.mandatory,
        questions: []
      };
    });

    questions.forEach(q => {
      if (roleMap[q.role]) {
        roleMap[q.role].questions.push(q);
      }
    });

    res.json({
      round: {
        id: activeRound._id,
        academicYear: activeRound.academicYear,
        cycle: activeRound.cycle,
        round: activeRound.round
      },
      schoolCode: school,
      departmentCode: department,
      roles: Object.values(roleMap),
      alreadyCompleted: false
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
};