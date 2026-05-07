const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
  key: String,
  name: String,
  mandatory: Boolean
});

module.exports = mongoose.model("Feedback360Role", RoleSchema, "feedback360_roles");