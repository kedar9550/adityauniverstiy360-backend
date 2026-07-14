const Feedback = require('../models/Feedback360Response');
const FeedbackRound = require('../models/Feedback360Round');
const Role = require('../models/Feedback360Role');

exports.submitFeedback = async (req, res) => {
  //console.log("Received feedback submission:", req.body);

  // Extract IP using common headers for reverse proxies (e.g. Nginx, Cloudflare)
  const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;

  try {

    const { school, department, designation, responses, roundId, browserSignature, giverRole, doj } = req.body;

    if (!school) {
      return res.status(400).json({ message: "School is required" })
    }

    if (!roundId) {
      return res.status(400).json({ message: "Round ID is required" })
    }

    if (!browserSignature) {
      return res.status(400).json({ message: "Browser signature is required to prevent duplicate submissions" })
    }

    if (!responses || responses.length === 0) {
      return res.status(400).json({ message: "No responses provided" })
    }

    // 1. Verify this round is the active one and dates are valid
    const activeRound = await FeedbackRound.findOne({ _id: roundId, active: true });

    if (!activeRound) {
      return res.status(403).json({ message: "The specified feedback round is either invalid or inactive." });
    }

    const currentDate = new Date();
    const startDate = new Date(activeRound.startDate);
    const endDate = new Date(activeRound.endDate);
    endDate.setHours(23, 59, 59, 999);

    if (currentDate < startDate || currentDate > endDate) {
      return res.status(403).json({
        message: `Feedback forms can only be submitted between ${startDate.toDateString()} and ${endDate.toDateString()}.`
      });
    }

    if (activeRound.dojCutoff && doj) {
      const dojDate = new Date(doj);
      const cutoffDate = new Date(activeRound.dojCutoff);
      if (dojDate > cutoffDate) {
        return res.status(403).json({
          message: "You are not eligible to provide feedback in this round as your Date of Joining is after the cutoff date."
        });
      }
    }

    // 2. Prevent Duplicate Submissions for the *same round*, *role*, and *Browser Signature/IP*
    // For 'hod' role, also check if it's the same department
    for (const r of responses) {
      const roleDoc = await Role.findById(r.role);
      if (!roleDoc) continue;

      let duplicateQuery = {
        round: roundId,
        role: r.role,
        department: roleDoc.key === 'hod' ? (department && department !== "" ? department : null) : undefined
      };

      if (browserSignature) {
        duplicateQuery.browserSignature = browserSignature;
      } else {
        duplicateQuery.ipAddress = ipAddress;
      }


      const existingRecord = await Feedback.findOne(duplicateQuery);

      if (existingRecord) {
        return res.status(409).json({ message: `A feedback submission has already been received for the role: ${roleDoc.name}.` });
      }
    }

    let docs = [];

    responses.forEach(r => {

      docs.push({
        school,
        department: department && department !== "" ? department : null,
        designation,
        role: r.role,
        targetPersonName: r.targetPersonName, // Save the name
        empId: r.empId,                     // Save the employee id
        round: roundId,
        ipAddress: ipAddress,
        browserSignature: browserSignature,
        giverRole: giverRole,
        ratingAnswers: r.ratingAnswers || [],
        textAnswers: r.textAnswers || []
      });

    });

    await Feedback.insertMany(docs);

    res.json({
      message: "Feedback Submitted Successfully",
      submittedRoles: docs.length
    });

  } catch (err) {
    console.log("Error submitting feedback:", err.message);

    res.status(500).json({ error: err.message });

  }

};