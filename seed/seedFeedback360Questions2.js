require("dotenv").config();
const mongoose = require("mongoose");

const Question = require("../models/Feedback360Question");
const Role = require("../models/Feedback360Role");
const QuestionSection = require("../models/Feedback360QuestionSection");

async function insertQuestions(roleId, questions, roleKey) {
  try {
    let count = 0;
    for (const q of questions) {
      // Find or create the section
      let sectionDoc = await QuestionSection.findOne({ section: q.section });
      if (!sectionDoc) {
        sectionDoc = new QuestionSection({ section: q.section });
        await sectionDoc.save();
      }

      await Question.updateOne(
        { question: q.question, role: roleId },
        { $set: { ...q, role: roleId, section: sectionDoc._id } },
        { upsert: true }
      );
      count++;
    }
    console.log(`Successfully seeded ${count} questions for role: ${roleKey}`);
  } catch (error) {
    console.error(`Error seeding questions for role ${roleKey}:`, error.message);
  }
}

async function seedQuestions() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const deanRC = await Role.findOne({ key: "dean_r&c" });
    const deanCareers = await Role.findOne({ key: "dean_careers" });
    const deanStudentAffairs = await Role.findOne({ key: "dean_student_affairs" });
    const deanAdmissions = await Role.findOne({ key: "dean_admissions" });
    const deanAdministration = await Role.findOne({ key: "dean_administration" });
    const deanIQAC = await Role.findOne({ key: "dean_iqac" });
    const controllerExaminations = await Role.findOne({ key: "CoE" });
    const deanIR = await Role.findOne({ key: "dean_ir" });
    const registrar = await Role.findOne({ key: "registrar" });

    const deanRCRole = deanRC?._id;
    const deanCareersRole = deanCareers?._id;
    const deanStudentAffairsRole = deanStudentAffairs?._id;
    const deanAdmissionsRole = deanAdmissions?._id;
    const deanAdministrationRole = deanAdministration?._id;
    const deanIQACRole = deanIQAC?._id;
    const controllerExaminationsRole = controllerExaminations?._id;
    const deanInternationalRelationsRole = deanIR?._id;
    const registrarRole = registrar?._id;

    const deanRCQuestions = [
      {
        section: "Dean Research & Consultancy Feedback",
        type: "rating",
        question: "Promotes research culture and consultancy initiatives across Schools.",
        order: 1,
      },
      {
        section: "Dean Research & Consultancy Feedback",
        type: "rating",
        question: "Facilitates access to research funding, grants, and collaborations.",
        order: 2,
      },
      {
        section: "Dean Research & Consultancy Feedback",
        type: "rating",
        question: "Supports faculty in publications, patents, and projects. ",
        order: 3,
      },
      {
        section: "Dean Research & Consultancy Feedback",
        type: "rating",
        question: " Communicates research policies and opportunities effectively.",
        order: 4,
      },
      {
        section: "Dean Research & Consultancy Feedback",
        type: "rating",
        question: "Encourages interdisciplinary and industry-linked research.",
        order: 5,
      },
      {
        section: "Open-Ended Feedback",
        type: "text",
        question: "Key strengths of the Associate Dean / Dean:",
        order: 6,
      },
      {
        section: "Open-Ended Feedback",
        type: "text",
        question: "Areas for improvement for the Associate Dean / Dean:",
        order: 7,
      },
      {
        section: "Open-Ended Feedback",
        type: "text",
        question: "Any specific concerns related to the Associate Dean / Dean:",
        order: 8,
      },
    ];

    const deanCareersQuestions = [
      {
        section: "Dean Career Development Feedback",
        type: "rating",
        question: "Strengthens student placement and internship opportunities. ",
        order: 1,
      },
      {
        section: "Dean Career Development Feedback",
        type: "rating",
        question: "Builds effective industry engagement and partnerships. ",
        order: 2,
      },
      {
        section: "Dean Career Development Feedback",
        type: "rating",
        question: "Supports faculty in aligning curriculum with employability needs.",
        order: 3,
      },
      {
        section: "Dean Career Development Feedback",
        type: "rating",
        question: "Communicates placement-related processes clearly.",
        order: 4,
      },
      {
        section: "Dean Career Development Feedback",
        type: "rating",
        question: "Enhances career readiness initiatives for students.",
        order: 5,
      },
      {
        section: "Open-Ended Feedback",
        type: "text",
        question: "Key strengths of the Associate Dean / Dean:",
        order: 6,
      },
      {
        section: "Open-Ended Feedback",
        type: "text",
        question: "Areas for improvement for the Associate Dean / Dean:",
        order: 7,
      },
      {
        section: "Open-Ended Feedback",
        type: "text",
        question: "Any specific concerns related to the Associate Dean / Dean:",
        order: 8,
      },
    ];

    const deanStudentAffairsQuestions = [
      {
        section: "Dean Student Affairs Feedback",
        type: "rating",
        question: "Ensures effective student support and welfare mechanisms. ",
        order: 1,
      },
      {
        section: "Dean Student Affairs Feedback",
        type: "rating",
        question: "Handles student-related issues fairly and efficiently. ",
        order: 2,
      },
      {
        section: "Dean Student Affairs Feedback",
        type: "rating",
        question: "Promotes student engagement and campus life.",
        order: 3,
      },
      {
        section: "Dean Student Affairs Feedback",
        type: "rating",
        question: "Maintains discipline and a positive campus environment.",
        order: 4,
      },
      {
        section: "Dean Student Affairs Feedback",
        type: "rating",
        question: "Is approachable and responsive to student concerns. ",
        order: 5,
      },
      {
        section: "Open-Ended Feedback",
        type: "text",
        question: "Key strengths of the Associate Dean / Dean:",
        order: 6,
      },
      {
        section: "Open-Ended Feedback",
        type: "text",
        question: "Areas for improvement for the Associate Dean / Dean:",
        order: 7,
      },
      {
        section: "Open-Ended Feedback",
        type: "text",
        question: "Any specific concerns related to the Associate Dean / Dean:",
        order: 8,
      },
    ];

    const deanAdmissionsQuestions = [
      {
        section: "Dean Admissions Feedback",
        type: "rating",
        question: "Ensures transparent and efficient admission processes.",
        order: 1,
      },
      {
        section: "Dean Admissions Feedback",
        type: "rating",
        question: "Maintains quality and diversity in student intake.",
        order: 2,
      },
      {
        section: "Dean Admissions Feedback",
        type: "rating",
        question: "Coordinates effectively with Schools.",
        order: 3,
      },
      {
        section: "Dean Admissions Feedback",
        type: "rating",
        question: "Communicates admission policies clearly.",
        order: 4,
      },
      {
        section: "Dean Admissions Feedback",
        type: "rating",
        question: "Ensures coordination between Faculty Coordinator and Admission Team",
        order: 5,
      },
      {
        section: "Open-Ended Feedback",
        type: "text",
        question: "Key strengths of the Associate Dean / Dean:",
        order: 6,
      },
      {
        section: "Open-Ended Feedback",
        type: "text",
        question: "Areas for improvement for the Associate Dean / Dean:",
        order: 7,
      },
      {
        section: "Open-Ended Feedback",
        type: "text",
        question: "Any specific concerns related to the Associate Dean / Dean:",
        order: 8,
      },
    ];

    const deanAdministrationQuestions = [
      {
        section: "Dean Administration Feedback",
        type: "rating",
        question: "Ensures smooth administrative operations across the University.",
        order: 1,
      },
      {
        section: "Dean Administration Feedback",
        type: "rating",
        question: "Supports faculty in administrative and logistical matters.",
        order: 2,
      },
      {
        section: "Dean Administration Feedback",
        type: "rating",
        question: "Maintains efficiency in institutional processes. ",
        order: 3,
      },
      {
        section: "Dean Administration Feedback",
        type: "rating",
        question: "Communicates administrative policies clearly.",
        order: 4,
      },
      {
        section: "Dean Administration Feedback",
        type: "rating",
        question: "Facilitates coordination across departments – academics and centralised.",
        order: 5,
      },
      {
        section: "Open-Ended Feedback",
        type: "text",
        question: "Key strengths of the Associate Dean / Dean:",
        order: 6,
      },
      {
        section: "Open-Ended Feedback",
        type: "text",
        question: "Areas for improvement for the Associate Dean / Dean:",
        order: 7,
      },
      {
        section: "Open-Ended Feedback",
        type: "text",
        question: "Any specific concerns related to the Associate Dean / Dean:",
        order: 8,
      },
    ];

    const deanIQACQuestions = [
      {
        section: "Dean IQAC Feedback",
        type: "rating",
        question: "Promotes quality assurance and continuous improvement practices.",
        order: 1,
      },
      {
        section: "Dean IQAC Feedback",
        type: "rating",
        question: "Ensures effective implementation of accreditation processes (NAAC/NBA). ",
        order: 2,
      },
      {
        section: "Dean IQAC Feedback",
        type: "rating",
        question: "Facilitates academic audits and reviews.  ",
        order: 3,
      },
      {
        section: "Dean IQAC Feedback",
        type: "rating",
        question: "Supports Schools in compliance and documentation.",
        order: 4,
      },
      {
        section: "Dean IQAC Feedback",
        type: "rating",
        question: "Communicates quality benchmarks clearly.  ",
        order: 5,
      },
      {
        section: "Open-Ended Feedback",
        type: "text",
        question: "Key strengths of the Associate Dean / Dean:",
        order: 6,
      },
      {
        section: "Open-Ended Feedback",
        type: "text",
        question: "Areas for improvement for the Associate Dean / Dean:",
        order: 7,
      },
      {
        section: "Open-Ended Feedback",
        type: "text",
        question: "Any specific concerns related to the Associate Dean / Dean:",
        order: 8,
      },
    ];

    const deanInternationalRelationsQuestions = [
      {
        section: "Dean International Relations Feedback",
        type: "rating",
        question: "Promotes international collaborations and partnerships. ",
        order: 1,
      },
      {
        section: "Dean International Relations Feedback",
        type: "rating",
        question: "Facilitates student and faculty exchange programs.",
        order: 2,
      },
      {
        section: "Dean International Relations Feedback",
        type: "rating",
        question: "Supports internationalization of curriculum. ",
        order: 3,
      },
      {
        section: "Dean International Relations Feedback",
        type: "rating",
        question: "Communicates global opportunities effectively.",
        order: 4,
      },
      {
        section: "Dean International Relations Feedback",
        type: "rating",
        question: "Enhances the University's global visibility.",
        order: 5,
      },
      {
        section: "Open-Ended Feedback",
        type: "text",
        question: "Key strengths of the Associate Dean / Dean:",
        order: 6,
      },
      {
        section: "Open-Ended Feedback",
        type: "text",
        question: "Areas for improvement for the Associate Dean / Dean:",
        order: 7,
      },
      {
        section: "Open-Ended Feedback",
        type: "text",
        question: "Any specific concerns related to the Associate Dean / Dean:",
        order: 8,
      },
    ];

    const controllerExaminationsQuestions = [
      {
        section: "Controller of Examinations Feedback",
        type: "rating",
        question: "Ensures timely and smooth conduct of examinations.",
        order: 1,
      },
      {
        section: "Controller of Examinations Feedback",
        type: "rating",
        question: "Maintains transparency and fairness in evaluation and its policies.",
        order: 2,
      },
      {
        section: "Controller of Examinations Feedback",
        type: "rating",
        question: "Communicates exam-related information clearly. ",
        order: 3,
      },
      {
        section: "Controller of Examinations Feedback",
        type: "rating",
        question: "Resolves examination-related issues efficiently.",
        order: 4,
      },
      {
        section: "Controller of Examinations Feedback",
        type: "rating",
        question: "Ensures timely declaration of results.",
        order: 5,
      },
      {
        section: "Open-Ended Feedback",
        type: "text",
        question: "Key strengths of Controller of Examinations:",
        order: 6,
      },
      {
        section: "Open-Ended Feedback",
        type: "text",
        question: "Areas for improvement for Controller of Examinations:",
        order: 7,
      },
      {
        section: "Open-Ended Feedback",
        type: "text",
        question: "Any specific concerns related to Controller of Examinations:",
        order: 8,
      },
    ];

    const registrarQuestions = [
      {
        section: "Registrar Feedback",
        type: "rating",
        question: "Ensures efficient academic and administrative governance.",
        order: 1,
      },
      {
        section: "Registrar Feedback",
        type: "rating",
        question: "Implements Policies and regulations fairly and consistently.",
        order: 2,
      },
      {
        section: "Registrar Feedback",
        type: "rating",
        question: "Supports Schools in procedural and regulatory matters.",
        order: 3,
      },
      {
        section: "Registrar Feedback",
        type: "rating",
        question: "Communicates administrative decisions clearly and timely.",
        order: 4,
      },
      {
        section: "Registrar Feedback",
        type: "rating",
        question: "Facilitates smooth coordination between faculty, administration, and management.",
        order: 5,
      },
      {
        section: "Open-Ended Feedback",
        type: "text",
        question: "Key strengths:",
        order: 6,
      },
      {
        section: "Open-Ended Feedback",
        type: "text",
        question: "Areas for improvement:",
        order: 7,
      },
      {
        section: "Open-Ended Feedback",
        type: "text",
        question: "Any specific concerns:",
        order: 8,
      },
    ];

    if (deanRCRole) await insertQuestions(deanRCRole, deanRCQuestions, "dean_r&c");
    else console.warn("Role not found: dean_r&c");

    if (deanCareersRole) await insertQuestions(deanCareersRole, deanCareersQuestions, "dean_careers");
    else console.warn("Role not found: dean_careers");

    if (deanStudentAffairsRole) await insertQuestions(deanStudentAffairsRole, deanStudentAffairsQuestions, "dean_student_affairs");
    else console.warn("Role not found: dean_student_affairs");

    if (deanAdmissionsRole) await insertQuestions(deanAdmissionsRole, deanAdmissionsQuestions, "dean_admissions");
    else console.warn("Role not found: dean_admissions");

    if (deanAdministrationRole) await insertQuestions(deanAdministrationRole, deanAdministrationQuestions, "dean_administration");
    else console.warn("Role not found: dean_administration");

    if (deanIQACRole) await insertQuestions(deanIQACRole, deanIQACQuestions, "dean_iqac");
    else console.warn("Role not found: dean_iqac");

    if (controllerExaminationsRole) await insertQuestions(controllerExaminationsRole, controllerExaminationsQuestions, "CoE");
    else console.warn("Role not found: CoE");

    if (deanInternationalRelationsRole) await insertQuestions(deanInternationalRelationsRole, deanInternationalRelationsQuestions, "dean_ir");
    else console.warn("Role not found: dean_ir");

    if (registrarRole) await insertQuestions(registrarRole, registrarQuestions, "registrar");
    else console.warn("Role not found: registrar");

    console.log("Seeding process completed.");
  } catch (error) {
    console.error("General seeding error:", error.message);
  } finally {
    mongoose.connection.close();
    process.exit();
  }
}

seedQuestions();
