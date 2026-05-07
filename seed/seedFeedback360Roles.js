require("dotenv").config();
const mongoose = require("mongoose");
const Role = require("../models/Feedback360Role");

mongoose.connect(process.env.MONGO_URI);

const roles = [

{ key:"hod", name:"Head of Department", mandatory:true },

{ key:"associate_dean_soe", name:"Associate Dean SOE", mandatory:true },

{ key:"associate_dean_fe", name:"Associate Dean FE", mandatory:true },

{ key:"associate_dean_sos", name:"Associate Dean SOS", mandatory:true },

{ key:"associate_dean_sob", name:"Associate Dean SOB", mandatory:true },

{ key:"dean_sop", name:"Dean SOP", mandatory:true },

{ key:"registrar", name:"Registrar", mandatory:false },

{ key:"pro_vc_academics", name:"Pro Vice Chancellor Academics", mandatory:false },

{ key:"pro_vc_es", name:"Pro Vice Chancellor E&S", mandatory:false },

{ key:"pro_vc_sp", name:"Pro Vice Chancellor S&P", mandatory:false }

];

async function seedRoles(){

for(const r of roles){

await Role.updateOne(
 {key:r.key},
 {$set:r},
 {upsert:true}
);

}

console.log("Roles Seeded");
process.exit();

}

seedRoles();