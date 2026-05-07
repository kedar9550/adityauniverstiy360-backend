require("dotenv").config();
const mongoose = require("mongoose");

const Department = require("../models/Feedback360Department");
const School = require("../models/Feedback360School");

async function seedDepartments() {

  try {

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    const soe = await School.findOne({ code: "SOE" });

    if (!soe) {
      console.log("SOE School not found. Run school seed first.");
      process.exit();
    }

    const departments = [

      {
        name: "Civil Engineering",
        code: "CE",
        school: soe._id
      },

      {
        name: " Electrical and Electronics Engineering",
        code: "EEE",
        school: soe._id
      },

      {
        name: "Mechanical Engineering",
        code: "ME",
        school: soe._id
      },

      {
        name: "Electronics and Communication Engineering",
        code: "ECE",
        school: soe._id
      },
      {
        name: "Computer Science and Engineering",
        code: "CSE",
        school: soe._id
      },
      {
        name: "Computer Science and Engineering - Data Science / Information Technology",
        code: "CSE-DS/IT",
        school: soe._id
      },
      {
        name: "Mining Engineering / Petroleum Technology",
        code: "Min.E/PT",
        school: soe._id
      },
       {
        name: "Artificial Intelligence & Machine Learning",
        code: "AI&ML",
        school: soe._id
      },
      {
        name: "Agricultural Engineering",
        code: "Ag.E",
        school: soe._id
      },

      {
        name: "Master of Computer Applications",
        code: "MCA",
        school: soe._id
      },

      {
        name: "Freshman Engineering-1",
        code: "FED-1",
        school: soe._id
      },
       {
        name: "Freshman Engineering-2",
        code: "FED-2",
        school: soe._id
      },
       {
        name: "Freshman Engineering-3",
        code: "FED-3",
        school: soe._id
      },
       {
        name: "Freshman Engineering-4",
        code: "FED-4",
        school: soe._id
      },
      {
        name: "Freshman Engineering-5",
        code: "FED-5",
        school: soe._id
      },

    ];

    for (const d of departments) {

      await Department.updateOne(
        { code: d.code },  
        { $set: d },        
        { upsert: true }   
      );

    }

    console.log("Departments Seeded Successfully");

  } catch (err) {

    console.error("Seed Error:", err);

  } finally {

    await mongoose.connection.close();
    process.exit();

  }

}

seedDepartments();