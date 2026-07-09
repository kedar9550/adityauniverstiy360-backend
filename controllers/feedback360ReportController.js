const mongoose = require("mongoose");
const Feedback = require("../models/Feedback360Response");
const Question = require("../models/Feedback360Question");
const Role = require("../models/Feedback360Role");
const FeedbackRound = require("../models/Feedback360Round");

const ratingLabels = {
  1: "Strongly Disagree",
  2: "Disagree",
  3: "Neutral",
  4: "Agree",
  5: "Strongly Agree"
};

/* -------------------------------------------------------
   GET LATEST ROUND
------------------------------------------------------- */

async function getLatestRoundId() {
  const latestRound = await FeedbackRound
    .findOne({}, { _id: 1 })
    .sort({ round: -1 })
    .lean();

  return latestRound?._id || null;
}

/* -------------------------------------------------------
   DASHBOARD STATS
------------------------------------------------------- */

exports.getDashboardStats = async (req, res) => {
  try {

    const { school, department, roundId } = req.query;

    let filter = {};
    let finalRoundId = roundId;

    if (!roundId || roundId === "all") {
      finalRoundId = await getLatestRoundId();
    }

    if (finalRoundId)
      filter.round = new mongoose.Types.ObjectId(finalRoundId);

    if (school && school !== "all")
      filter.school = new mongoose.Types.ObjectId(school);

    if (department && department !== "all")
      filter.department = new mongoose.Types.ObjectId(department);

    const stats = await Feedback.aggregate([
      { $match: filter },

      { $unwind: "$ratingAnswers" },

      {
        $lookup: {
          from: "feedback360_roles",
          localField: "role",
          foreignField: "_id",
          as: "role"
        }
      },

      { $unwind: "$role" },

      {
        $lookup: {
          from: "feedback360_departments",
          localField: "department",
          foreignField: "_id",
          as: "dept"
        }
      },

      { $unwind: { path: "$dept", preserveNullAndEmptyArrays: true } },

      {
        $facet: {

          overall: [
            {
              $group: {
                _id: null,
                totalFeedback: { $addToSet: "$_id" },
                totalRatingsSum: { $sum: "$ratingAnswers.rating" },
                ratingsCount: { $sum: 1 }
              }
            }
          ],

          byRoleAndDept: [
            {
              $group: {
                _id: {
                  role: "$role.key",
                  department: "$department"
                },
                totalFeedback: { $addToSet: "$_id" },
                avgRating: { $avg: "$ratingAnswers.rating" },
                departmentCode: { $first: "$dept.code" },
                departmentName: { $first: "$dept.name" },
                targetPersonName: { $max: "$targetPersonName" },
                empId: { $max: "$empId" }
              }
            }
          ]
        }
      }
    ]);

    if (!stats || stats.length === 0)
      return res.json({ totalFeedback: 0, overallAvgRating: 0, roleStats: {} });

    const result = stats[0];

    let overallStats = { totalFeedback: 0, overallAvgRating: 0 };

    if (result.overall.length > 0) {

      const overall = result.overall[0];

      overallStats.totalFeedback = overall.totalFeedback.length;

      const avg =
        overall.ratingsCount === 0
          ? 0
          : overall.totalRatingsSum / overall.ratingsCount;

      overallStats.overallAvgRating = Number(avg.toFixed(2));
    }

    const roleStats = {};

    result.byRoleAndDept.forEach(r => {

      const roleKey = r._id.role;
      const deptId = r._id.department ? r._id.department.toString() : null;

      const statsObj = {
        totalFeedback: r.totalFeedback.length,
        avgRating: Number(r.avgRating.toFixed(2))
      };

      if (roleKey === "hod" && deptId) {

        roleStats[`${roleKey}_${deptId}`] = {
          ...statsObj,
          role: roleKey,
          department: deptId,
          departmentCode: r.departmentCode || "N/A",
          departmentName: r.departmentName || "N/A",
          targetPersonName: r.targetPersonName || "",
          empId: r.empId || ""
        };

      } else {

        if (!roleStats[roleKey]) {
          roleStats[roleKey] = {
            ...statsObj,
            targetPersonName: r.targetPersonName || "",
            empId: r.empId || ""
          };
        } else {

          const existing = roleStats[roleKey];

          const totalFeedback =
            existing.totalFeedback + statsObj.totalFeedback;

          const newAvg =
            (existing.avgRating * existing.totalFeedback +
              statsObj.avgRating * statsObj.totalFeedback) /
            totalFeedback;

          roleStats[roleKey] = {
            totalFeedback,
            avgRating: Number(newAvg.toFixed(2)),
            targetPersonName: existing.targetPersonName || r.targetPersonName || "",
            empId: existing.empId || r.empId || ""
          };
        }
      }
    });

    res.json({
      ...overallStats,
      roleStats
    });

  } catch (err) {

    console.error("Error fetching dashboard stats:", err);

    res.status(500).json({ error: "Server Error: Could not fetch stats" });
  }
};

/* -------------------------------------------------------
   REPORT
------------------------------------------------------- */

exports.getReport = async (req, res) => {

  try {

    const { role, school, department, roundId, giverRole } = req.query;

    if (!role)
      return res.status(400).json({ message: "Role is required" });

    const roleDoc = await Role.findOne({ key: role }, { _id: 1 }).lean();

    if (!roleDoc)
      return res.status(404).json({ message: "Role not found" });

    let filter = { role: roleDoc._id };

    if (school && school !== "all")
      filter.school = new mongoose.Types.ObjectId(school);

    if (department && department !== "all")
      filter.department = new mongoose.Types.ObjectId(department);

    let finalRoundId = roundId;

    if (!roundId || roundId === "all")
      finalRoundId = await getLatestRoundId();

    if (finalRoundId)
      filter.round = new mongoose.Types.ObjectId(finalRoundId);

    // Filter by giver role bucket if requested
    const universityDeanKeysGR = [
      "dean_r&c", "dean_careers", "dean_student_affairs", "dean_admissions",
      "dean_administration", "dean_iqac", "CoE", "dean_ir",
      "associate_dean_soe", "associate_dean_fe", "associate_dean_sos",
      "associate_dean_sob", "dean_sop", "Assoc Dean/Dean", "Assoc Dean - SOE", "Dean - SOE"
    ];
    if (giverRole === "Faculty") filter.giverRole = "Faculty";
    else if (giverRole === "HOD") filter.giverRole = "HOD";
    else if (giverRole === "Dean") filter.giverRole = { $in: universityDeanKeysGR };

    const ratingResults = await Feedback.aggregate([
      { $match: filter },

      { $unwind: "$ratingAnswers" },

      {
        $group: {
          _id: "$ratingAnswers.questionId",
          avgRating: { $avg: "$ratingAnswers.rating" },
          responses: { $sum: 1 },
          ratings: { $push: "$ratingAnswers.rating" }
        }
      },

      {
        $lookup: {
          from: "feedback360_questions",
          localField: "_id",
          foreignField: "_id",
          as: "question"
        }
      },

      { $unwind: "$question" },

      {
        $lookup: {
          from: "feedback360_question_sections",
          localField: "question.section",
          foreignField: "_id",
          as: "section"
        }
      },

      { $unwind: "$section" },
      { $sort: { "question.order": 1 } }
    ]);

    const textResults = await Feedback.aggregate([
      { $match: filter },

      { $unwind: "$textAnswers" },

      {
        $group: {
          _id: "$textAnswers.questionId",
          answers: { $push: "$textAnswers.answer" }
        }
      },

      {
        $lookup: {
          from: "feedback360_questions",
          localField: "_id",
          foreignField: "_id",
          as: "question"
        }
      },

      { $unwind: "$question" },
      { $sort: { "question.order": 1 } }
    ]);

    const totalResponses = await Feedback.countDocuments(filter);
    const sampleDoc = await Feedback.findOne(filter).select("targetPersonName empId").lean();

    // Giver role breakdown with avg rating per bucket
    const giverRoleAgg = await Feedback.aggregate([
      { $match: filter },
      { $unwind: "$ratingAnswers" },
      {
        $group: {
          _id: "$giverRole",
          count: { $addToSet: "$_id" },
          ratingSum: { $sum: "$ratingAnswers.rating" },
          ratingCount: { $sum: 1 }
        }
      }
    ]);

    // Group into Faculty / HoD / Dean buckets
    const universityDeanKeys = [
      "dean_r&c", "dean_careers", "dean_student_affairs", "dean_admissions",
      "dean_administration", "dean_iqac", "CoE", "dean_ir",
      "associate_dean_soe", "associate_dean_fe", "associate_dean_sos",
      "associate_dean_sob", "dean_sop", "Assoc Dean/Dean", "Assoc Dean - SOE", "Dean - SOE"
    ];

    const giverRoleBuckets = {
      Faculty: { count: 0, ratingSum: 0, ratingCount: 0 },
      HOD:     { count: 0, ratingSum: 0, ratingCount: 0 },
      Dean:    { count: 0, ratingSum: 0, ratingCount: 0 },
    };

    giverRoleAgg.forEach(g => {
      const role = g._id || "";
      let bucket = null;
      if (role === "Faculty") bucket = "Faculty";
      else if (role === "HOD") bucket = "HOD";
      else if (universityDeanKeys.includes(role)) bucket = "Dean";
      if (bucket) {
        giverRoleBuckets[bucket].count += g.count.length;
        giverRoleBuckets[bucket].ratingSum += g.ratingSum;
        giverRoleBuckets[bucket].ratingCount += g.ratingCount;
      }
    });

    const giverRoleStats = {};
    Object.entries(giverRoleBuckets).forEach(([key, val]) => {
      giverRoleStats[key] = {
        count: val.count,
        avgRating: val.ratingCount > 0 ? Number((val.ratingSum / val.ratingCount).toFixed(2)) : 0
      };
    });

    if (totalResponses === 0) {
      return res.json({
        responses: 0,
        overallRating: 0,
        sections: [],
        questions: [],
        suggestions: [],
        giverRoleStats
      });
    }

    let sectionMap = {};
    let questionReports = [];

    let totalRating = 0;
    let totalCount = 0;

    ratingResults.forEach(q => {

      const ratings = q.ratings;

      const avg = q.avgRating;

      totalRating += avg * ratings.length;
      totalCount += ratings.length;

      let distCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

      ratings.forEach(r => distCount[r]++);

      const distribution = Object.keys(distCount).map(r => ({
        rating: Number(r),
        label: ratingLabels[r],
        count: distCount[r]
      }));

      const sectionName = q.section.section;

      questionReports.push({
        questionId: q._id,
        question: q.question.question,
        section: sectionName,
        responses: ratings.length,
        avgRating: Number(avg.toFixed(2)),
        distribution
      });

      if (!sectionMap[sectionName])
        sectionMap[sectionName] = [];

      sectionMap[sectionName].push(avg);
    });

    const sectionReports = Object.keys(sectionMap).map(section => {

      const arr = sectionMap[section];

      const avg = arr.reduce((a, b) => a + b, 0) / arr.length;

      return {
        section,
        avgRating: Number(avg.toFixed(2))
      };
    });

    const suggestions = textResults.map(q => ({
      questionId: q._id,
      question: q.question.question,
      answers: q.answers
    }));

    const overallRating = totalCount ? totalRating / totalCount : 0;

    res.json({

      responses: totalResponses,

      overallRating: Number(overallRating.toFixed(2)),

      sections: sectionReports,

      questions: questionReports,

      suggestions,
      targetPersonName: sampleDoc?.targetPersonName || "",
      empId: sampleDoc?.empId || "",
      giverRoleStats
    });

  } catch (err) {

    res.status(500).json({ error: err.message });
  }
};

/* -------------------------------------------------------
   ROUND COMPARISON
------------------------------------------------------- */

exports.getRoundComparison = async (req, res) => {

  try {

    const { round1, round2, role, school, department, giverRole } = req.query;

    if (!round1 || !round2 || !role)
      return res.status(400).json({ message: "round1, round2, and role are required parameters." });

    const roleDoc = await Role.findOne({ key: role }, { _id: 1 }).lean();

    if (!roleDoc)
      return res.status(404).json({ message: "Role not found" });

    let baseFilter = { role: roleDoc._id };

    if (school && school !== "all")
      baseFilter.school = new mongoose.Types.ObjectId(school);

    if (department && department !== "all")
      baseFilter.department = new mongoose.Types.ObjectId(department);

    const universityDeanKeysGR = [
      "dean_r&c", "dean_careers", "dean_student_affairs", "dean_admissions",
      "dean_administration", "dean_iqac", "CoE", "dean_ir",
      "associate_dean_soe", "associate_dean_fe", "associate_dean_sos",
      "associate_dean_sob", "dean_sop", "Assoc Dean/Dean", "Assoc Dean - SOE", "Dean - SOE"
    ];
    if (giverRole === "Faculty") baseFilter.giverRole = "Faculty";
    else if (giverRole === "HOD") baseFilter.giverRole = "HOD";
    else if (giverRole === "Dean") baseFilter.giverRole = { $in: universityDeanKeysGR };

    const results = await Feedback.aggregate([

      {
        $match: {
          ...baseFilter,
          round: {
            $in: [
              new mongoose.Types.ObjectId(round1),
              new mongoose.Types.ObjectId(round2)
            ]
          }
        }
      },

      { $unwind: "$ratingAnswers" },

      {
        $group: {
          _id: {
            round: "$round",
            questionId: "$ratingAnswers.questionId"
          },
          avgRating: { $avg: "$ratingAnswers.rating" },
          responses: { $sum: 1 },
          empId: { $first: "$empId" },
          targetPersonName: { $first: "$targetPersonName" }
        }
      },

      {
        $lookup: {
          from: "feedback360_questions",
          localField: "_id.questionId",
          foreignField: "_id",
          as: "question"
        }
      },

      { $unwind: "$question" },
      { $sort: { "question.order": 1 } },

      {
        $lookup: {
          from: "feedback360_question_sections",
          localField: "question.section",
          foreignField: "_id",
          as: "section"
        }
      },

      { $unwind: "$section" }

    ]);

    let comparisonMap = {};

    let round1Total = 0, round1Count = 0;
    let round2Total = 0, round2Count = 0;

    results.forEach(r => {

      const qId = r._id.questionId.toString();

      if (!comparisonMap[qId]) {

        comparisonMap[qId] = {

          questionId: r._id.questionId,

          question: r.question.question,

          section: r.section.section,

          round1: { avgRating: 0, responses: 0 },

          round2: { avgRating: 0, responses: 0 }
        };
      }

      if (r._id.round.toString() === round1) {

        comparisonMap[qId].round1 = {
          avgRating: Number(r.avgRating.toFixed(2)),
          responses: r.responses
        };

        round1Total += r.avgRating;
        round1Count++;

      } else {

        comparisonMap[qId].round2 = {
          avgRating: Number(r.avgRating.toFixed(2)),
          responses: r.responses
        };

        round2Total += r.avgRating;
        round2Count++;
      }
    });

    const questions = Object.values(comparisonMap).map(q => {

      let improvement = 0;

      if (q.round1.avgRating > 0 && q.round2.avgRating > 0)
        improvement = Number((q.round2.avgRating - q.round1.avgRating).toFixed(2));

      return { ...q, improvement };
    });

    const r1Overall = round1Count ? Number((round1Total / round1Count).toFixed(2)) : 0;
    const r2Overall = round2Count ? Number((round2Total / round2Count).toFixed(2)) : 0;

    const overallImprovement =
      r1Overall && r2Overall
        ? Number((r2Overall - r1Overall).toFixed(2))
        : 0;

    const r1EmpId = results.find(r => r._id.round.toString() === round1)?.empId;
    const r2EmpId = results.find(r => r._id.round.toString() === round2)?.empId;
    const r1Name = results.find(r => r._id.round.toString() === round1)?.targetPersonName;
    const r2Name = results.find(r => r._id.round.toString() === round2)?.targetPersonName;

    res.json({
      round1Overall: r1Overall,
      round2Overall: r2Overall,
      overallImprovement,
      questions,
      r1EmpId,
      r2EmpId,
      r1Name,
      r2Name,
      isSamePerson: r1EmpId === r2EmpId && !!r1EmpId
    });

  } catch (err) {

    console.error("Comparison Error:", err);

    res.status(500).json({ error: err.message });
  }
};

/* -------------------------------------------------------
   GIVER ROLE STATS
------------------------------------------------------- */

exports.getGiverRoleStats = async (req, res) => {
  try {
    const { roundId } = req.query;
    let filter = {};
    let finalRoundId = roundId;

    if (!roundId || roundId === "all") {
      finalRoundId = await getLatestRoundId();
    }

    if (finalRoundId)
      filter.round = new mongoose.Types.ObjectId(finalRoundId);

    const universityDeanKeys = [
      "dean_r&c", "dean_careers", "dean_student_affairs", "dean_admissions",
      "dean_administration", "dean_iqac", "CoE", "dean_ir",
      "associate_dean_soe", "associate_dean_fe", "associate_dean_sos",
      "associate_dean_sob", "dean_sop", "Assoc Dean/Dean", "Assoc Dean - SOE", "Dean - SOE"
    ];

    const stats = await Feedback.aggregate([
      { $match: filter },
      {
        $addFields: {
          bucketedRole: {
            $cond: [
              { $eq: ["$giverRole", "Faculty"] },
              "Faculty",
              {
                $cond: [
                  { $eq: ["$giverRole", "HOD"] },
                  "HOD",
                  {
                    $cond: [
                      { $in: ["$giverRole", universityDeanKeys] },
                      "Dean",
                      "$giverRole"
                    ]
                  }
                ]
              }
            ]
          }
        }
      },
      {
        $group: {
          _id: "$bucketedRole",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          role: "$_id",
          count: 1,
          _id: 0
        }
      },
      { $sort: { role: 1 } }
    ]);

    res.json(stats);
  } catch (err) {
    console.error("Error fetching giver role stats:", err);
    res.status(500).json({ error: "Server Error: Could not fetch giver role stats" });
  }
};