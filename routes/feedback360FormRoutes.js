const express = require("express");
const router = express.Router();

const {getFeedbackForm} = require("../controllers/feedback360FormController");

router.post("/",getFeedbackForm);

module.exports = router;