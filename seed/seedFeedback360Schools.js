require("dotenv").config();
const mongoose = require("mongoose");
const School = require("../models/Feedback360School");

const schools = [
 { name: "School of Engineering", code: "SOE" },
 { name: "School of Science", code: "SOS" },
 { name: "School of Pharmacy", code: "SOP" },
 { name: "School of Business", code: "SOB" }
];

async function seedSchools(){

 try {

  await mongoose.connect(process.env.MONGO_URI);
  console.log("Mongo Connected");

  for(const s of schools){

   await School.updateOne(
    {code:s.code},
    {$set:s},
    {upsert:true}
   );

  }

  console.log("Schools Seeded");

 } catch(err){

  console.error(err);

 } finally{

  await mongoose.connection.close();
  process.exit();

 }

}

seedSchools();