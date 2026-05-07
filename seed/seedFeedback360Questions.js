require("dotenv").config();
const mongoose = require("mongoose");

const Question = require("../models/Feedback360Question");
const Role = require("../models/Feedback360Role");

async function insertQuestions(roleId, questions) {

  for (const q of questions) {

    await Question.updateOne(
      { question: q.question, role: roleId },
      { $set: { ...q, role: roleId } },
      { upsert: true }
    );

  }

}

async function seedQuestions() {

  await mongoose.connect(process.env.MONGO_URI);

  const hod = await Role.findOne({ key: "hod" });
  const associateDeanSoe = await Role.findOne({ key: "associate_dean_soe" });
  const associateDeanFe = await Role.findOne({ key: "associate_dean_fe" });
  const associateDeanSos = await Role.findOne({ key: "associate_dean_sos" });
  const associateDeanSob = await Role.findOne({ key: "associate_dean_sob" });
  const deanSop = await Role.findOne({ key: "dean_sop" });

  const registrar = await Role.findOne({ key: "registrar" });

  const proVcAcademics = await Role.findOne({ key: "pro_vc_academics" });
  const proVcEs = await Role.findOne({ key: "pro_vc_es" });
  const proVcSp = await Role.findOne({ key: "pro_vc_sp" });

  const hodRole = hod._id;

  const deanRoles = [
    associateDeanSoe._id,
    associateDeanFe._id,
    associateDeanSos._id,
    associateDeanSob._id,
    deanSop._id
  ];

  const registrarRole = registrar._id;

  const proVcAcademicRole = proVcAcademics._id;
  const proVcEsRole = proVcEs._id;
  const proVcSpRole = proVcSp._id;

  const hodQuestions = [
    {
      section: "Leadership & Vision",
      type: "rating",
      question: "Demonstrates clear academic and strategic vision.",
      order: 1
    },
    {
      section: "Leadership & Vision",
      type: "rating",
      question: "Aligns departmental goals with School and University objectives.",
      order: 2
    },
    {
      section: "Leadership & Vision",
      type: "rating",
      question: "Takes initiative in academic planning and improvement.",
      order: 3
    },
    {
      section: "Leadership & Vision",
      type: "rating",
      question: "Encourages innovation and continuous improvement.",
      order: 4
    },
    {
      section: "Communication & Transparency",
      type: "rating",
      question: "Communicates decisions clearly and on time.",
      order: 5
    },
     {
      section: "Communication & Transparency",
      type: "rating",
      question: "Listens to faculty concerns and feedback.",
      order: 6
    },
    {
      section: "Communication & Transparency",
      type: "rating",
      question: "Maintains transparency in departmental matters.",
      order: 7
    },
    {
      section: "Communication & Transparency",
      type: "rating",
      question: "Encourages open and respectful communication.",
      order: 8
    },
    {
      section: "Fairness, Ethics & Governance",
      type: "rating",
      question: "Treats all faculty members fairly and impartially.",
      order: 9
    },
    {
      section: "Fairness, Ethics & Governance",
      type: "rating",
      question: "Adheres to institutional policies and procedures.",
      order: 10
    },
    {
      section: "Fairness, Ethics & Governance",
      type: "rating",
      question: "Demonstrates ethical leadership.",
      order: 11
    },
    {
      section: "Fairness, Ethics & Governance",
      type: "rating",
      question: "Handles conflicts professionally.",
      order: 12
    },
    {
      section: "Faculty Support & Engagement",
      type: "rating",
      question: "Supports faculty in teaching, research, and development.",
      order: 13
    },
    {
      section: "Faculty Support & Engagement",
      type: "rating",
      question: "Is approachable and supportive.",
      order: 14
    },
    {
      section: "Faculty Support & Engagement",
      type: "rating",
      question: "Recognizes faculty contributions.",
      order: 15
    },
    {
      section: "Faculty Support & Engagement",
      type: "rating",
      question: "Encourages a positive departmental culture.",
      order: 16
    },
    {
      section: "Administration Effectiveness",
      type: "rating",
      question: "Manages departmental academic and administrative processes effectively.",
      order: 17
    },
    {
      section: "Administration Effectiveness",
      type: "rating",
      question: "Resolves faculty issues in a timely manner.",
      order: 18
    },
    {
      section: "Administration Effectiveness",
      type: "rating",
      question: "Delegates responsibilities appropriately.",
      order: 19
    },
    {
      section: "Administration Effectiveness",
      type: "rating",
      question: "Ensures smooth departmental operations.",
      order: 20
    },
    {
      section: "Decision-Making & Problem-Solving",
      type: "rating",
      question: "Makes informed and timely decisions.",
      order: 21
    },
    {
      section: "Decision-Making & Problem-Solving",
      type: "rating",
      question: "Considers faculty inputs.",
      order: 22
    },
    {
      section: "Decision-Making & Problem-Solving",
      type: "rating",
      question: "Handles challenges constructively.",
      order: 23
    },
    {
      section: "Overall Leadership Effectiveness",
      type: "rating",
      question: "Overall, the HoD is an effective academic leader.",
      order: 24
    },
    {
      section: "Overall Leadership Effectiveness",
      type: "rating",
      question: "Positively impacts departmental morale and performance.",
      order: 25
    },
    {
      section: "Open-Ended Feedback",
      type: "text",
      question: "Key strengths of the HoD:",
      order: 26
    },
    {
      section: "Open-Ended Feedback",
      type: "text",
      question: "Areas for improvement for the HoD:",
      order: 27
    },
    {
      section: "Open-Ended Feedback",
      type: "text",
      question: "Any specific concerns related to the HoD:",
      order: 28
    },


  ];

  const deanQuestions = [
    {
      section: "Leadership & Vision",
      type: "rating",
      question: "Demonstrates clear School-level academic vision.",
      order: 1
    },
    {
      section: "Leadership & Vision",
      type: "rating",
      question: "Aligns School goals with University strategy.",
      order: 2
    },
    {
      section: "Leadership & Vision",
      type: "rating",
      question: "Supports departments in achieving academic excellence.",
      order: 3
    },
    {
      section: "Leadership & Vision",
      type: "rating",
      question: "Encourages interdisciplinary and innovative initiatives.",
      order: 4
    },
    {
      section: "Communication & Transparency",
      type: "rating",
      question: "Communicates School-level decisions effectively.",
      order: 5
    },
     {
      section: "Communication & Transparency",
      type: "rating",
      question: "Ensures transparency across departments.",
      order: 6
    },
    {
      section: "Communication & Transparency",
      type: "rating",
      question: "Is responsive to faculty and HoD concerns.",
      order: 7
    },
    {
      section: "Communication & Transparency",
      type: "rating",
      question: "Facilitates effective communication between School and departments.",
      order: 8
    },
    {
      section: "Fairness, Ethics & Governance",
      type: "rating",
      question: "Ensures fairness across departments within the School.",
      order: 9
    },
    {
      section: "Fairness, Ethics & Governance",
      type: "rating",
      question: "Applies polices consistently.",
      order: 10
    },
    {
      section: "Fairness, Ethics & Governance",
      type: "rating",
      question: "Demonstrates ethical decision-making.",
      order: 11
    },
    {
      section: "Fairness, Ethics & Governance",
      type: "rating",
      question: "Resolves School-level issues objectively.",
      order: 12
    },
    {
      section: "Faculty Support & Engagement",
      type: "rating",
      question: "Supports faculty initiatives at the School level.",
      order: 13
    },
    {
      section: "Faculty Support & Engagement",
      type: "rating",
      question: "Facilitates professional development opportunities.",
      order: 14
    },
    {
      section: "Faculty Support & Engagement",
      type: "rating",
      question: "Encourages collaboration across departments.",
      order: 15
    },
    {
      section: "Faculty Support & Engagement",
      type: "rating",
      question: "Promotes faculty engagement and morale.",
      order: 16
    },
    {
      section: "Administration Effectiveness",
      type: "rating",
      question: "Manages School-level administrative functions effectively.",
      order: 17
    },
    {
      section: "Administration Effectiveness",
      type: "rating",
      question: "Coordinates efficiently with HoDs.",
      order: 18
    },
    {
      section: "Administration Effectiveness",
      type: "rating",
      question: "Supports departments in administrative matters.",
      order: 19
    },
    {
      section: "Administration Effectiveness",
      type: "rating",
      question: "Ensures consistency in School operations.",
      order: 20
    },
    {
      section: "Decision-Making & Problem-Solving",
      type: "rating",
      question: "Makes balanced School-level decisions.",
      order: 21
    },
    {
      section: "Decision-Making & Problem-Solving",
      type: "rating",
      question: "Considers departmental perspectives.",
      order: 22
    },
    {
      section: "Decision-Making & Problem-Solving",
      type: "rating",
      question: "Handles complex issues effectively.",
      order: 23
    },
    {
      section: "Overall Leadership Effectiveness",
      type: "rating",
      question: "Overall, the Associate Dean is an effective School leader.",
      order: 24
    },
    {
      section: "Overall Leadership Effectiveness",
      type: "rating",
      question: "Positively impacts School functioning and culture.",
      order: 25
    },
    {
      section: "Open-Ended Feedback",
      type: "text",
      question: "Key strengths of the Associate Dean / Dean:",
      order: 26
    },
    {
      section: "Open-Ended Feedback",
      type: "text",
      question: "Areas for improvement for the Associate Dean / Dean:",
      order: 27
    },
    {
      section: "Open-Ended Feedback",
      type: "text",
      question: "Any specific concerns related to the Associate Dean / Dean:",
      order: 28
    },


  ];;

  const registrarQuestions = [
    {
      section: "Registrar Feedback",
      type: "rating",
      question: "Ensures effecient academic and administrative governance.",
      order: 1
    },
    {
      section: "Registrar Feedback",
      type: "rating",
      question: "Implements Polices and regulations fairly and consistently.",
      order: 2
    },
    {
      section: "Registrar Feedback",
      type: "rating",
      question: "Supports Schools in procedural and regulatory matters.",
      order: 3
    },
    {
      section: "Registrar Feedback",
      type: "rating",
      question: "Communicates administrative decisions clearly and timely.",
      order: 4
    },
    {
      section: "Registrar Feedback",
      type: "rating",
      question: "Facilitates smooth coordination between faculty, administration, and management.",
      order: 5
    },
    {
      section: "Open-Ended Feedback",
      type: "text",
      question: "Key strengths:",
      order: 6
    },
    {
      section: "Open-Ended Feedback",
      type: "text",
      question: "Areas for improvement:",
      order: 7
    },
    {
      section: "Open-Ended Feedback",
      type: "text",
      question: "Any specific concerns:",
      order: 8
    },

  ];

  const proVcAcademicsQuestions = [
   {
      section: "Pro Vice Chancellor (Academics) Feedback",
      type: "rating",
      question: "Provides clear academic leadership at the University level.",
      order: 1
    },
    {
      section: "Pro Vice Chancellor (Academics) Feedback",
      type: "rating",
      question: "Ensures consisteency and quality in teaching-learning processes.",
      order: 2
    },
    {
      section: "Pro Vice Chancellor (Academics) Feedback",
      type: "rating",
      question: "Supports curriculum design, reforms, and academic governance.",
      order: 3
    },
    {
      section: "Pro Vice Chancellor (Academics) Feedback",
      type: "rating",
      question: "Promotes research, innovation, and academic integrity.",
      order: 4
    },
    {
      section: "Pro Vice Chancellor (Academics) Feedback",
      type: "rating",
      question: "Is responsive to academic concerns raised by faculty and HoDs.",
      order: 5
    },
    {
      section: "Open-Ended Feedback",
      type: "text",
      question: "Key strengths:",
      order: 6
    },
    {
      section: "Open-Ended Feedback",
      type: "text",
      question: "Areas for improvement:",
      order: 7
    },
    {
      section: "Open-Ended Feedback",
      type: "text",
      question: "Any specific concerns:",
      order: 8
    },
  ];

  const proVcEsQuestions = [
    {
      section: "Pro Vice Chancellor (Engineering & Science) Feedback",
      type: "rating",
      question: "Provides effective leadership for Engineering and Science disciplines.",
      order: 1
    },
    {
      section: "Pro Vice Chancellor (Engineering & Science) Feedback",
      type: "rating",
      question: "Supports curriculum modernization and technological advancement.",
      order: 2
    },
    {
      section: "Pro Vice Chancellor (Engineering & Science) Feedback",
      type: "rating",
      question: "Encourages interdisciplinary research and innovation.",
      order: 3
    },
    {
      section: "Pro Vice Chancellor (Engineering & Science) Feedback",
      type: "rating",
      question: "Addresses academic and infrastructure needs of technical Schools.",
      order: 4
    },
    {
      section: "Pro Vice Chancellor (Engineering & Science) Feedback",
      type: "rating",
      question: "Facilitates coordination between Engineering and Sciences.",
      order: 5
    },
    {
      section: "Open-Ended Feedback",
      type: "text",
      question: "Key strengths:",
      order: 6
    },
    {
      section: "Open-Ended Feedback",
      type: "text",
      question: "Areas for improvement:",
      order: 7
    },
    {
      section: "Open-Ended Feedback",
      type: "text",
      question: "Any specific concerns:",
      order: 8
    },
  ];

  const proVcSpQuestions = [
   {
      section: "Pro Vice Chancellor (Strategy & Partnerships) Feedback",
      type: "rating",
      question: "Provides clear stategic direction for institutional growth and partnerships.",
      order: 1
    },
    {
      section: "Pro Vice Chancellor (Strategy & Partnerships) Feedback",
      type: "rating",
      question: "Strengthens industry,academic, and international collaborations.",
      order: 2
    },
    {
      section: "Pro Vice Chancellor (Strategy & Partnerships) Feedback",
      type: "rating",
      question: "Communicates partnership-related-related initiatives transparently.",
      order: 3
    },
    {
      section: "Pro Vice Chancellor (Strategy & Partnerships) Feedback",
      type: "rating",
      question: "Ensures strategic initiatives align with academic goals.",
      order: 4
    },
    {
      section: "Pro Vice Chancellor (Strategy & Partnerships) Feedback",
      type: "rating",
      question: "Encourages Schools to participate in external collaborations.",
      order: 5
    },
    {
      section: "Open-Ended Feedback",
      type: "text",
      question: "Key strengths:",
      order: 6
    },
    {
      section: "Open-Ended Feedback",
      type: "text",
      question: "Areas for improvement:",
      order: 7
    },
    {
      section: "Open-Ended Feedback",
      type: "text",
      question: "Any specific concerns:",
      order: 8
    },
  ];

  await insertQuestions(hodRole, hodQuestions);

  for (const roleId of deanRoles) {
    await insertQuestions(roleId, deanQuestions);
  }

  await insertQuestions(registrarRole, registrarQuestions);
  await insertQuestions(proVcAcademicRole, proVcAcademicsQuestions);
  await insertQuestions(proVcEsRole, proVcEsQuestions);
  await insertQuestions(proVcSpRole, proVcSpQuestions);

  console.log("Questions Seeded Successfully");

  mongoose.connection.close();
  process.exit();

}

seedQuestions();