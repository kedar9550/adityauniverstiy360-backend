const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require("dotenv").config();
const cors = require('cors');
const connectDB = require("./config/db");





// 360feedback routes
const feedback360RoleRoutes = require("./routes/feedback360RoleRoutes");
const feedback360QuestionRoutes = require("./routes/feedback360QuestionRoutes");
const feedback360QuestionSectionRoutes = require("./routes/feedback360QuestionSectionRoutes");
const feedback360ResponseRoutes = require("./routes/feedback360ResponseRoutes");
const feedback360SchoolRoutes = require("./routes/feedback360SchoolRoutes");
const feedback360DepartmentRoutes = require("./routes/feedback360DepartmentRoutes");
const feedback360FormRoutes = require("./routes/feedback360FormRoutes");
const feedback360ReportRoutes = require("./routes/feedback360ReportRoutes");
const feedback360RoundRoutes = require("./routes/feedback360RoundRoutes");
const feedback360RoleAssignmentRoutes = require("./routes/feedback360RoleAssignmentRoutes");
const authRoutes = require("./routes/authRoutes");
const { protect, authorize } = require("./middleware/authMiddleware");




const app = express();
app.set('trust proxy', 1); // Trust first proxy (Render)
connectDB();

app.use(cors({
  origin: process.env.FRONTEND_URI,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
}));

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use("/feedback360/roles", feedback360RoleRoutes);
app.use("/feedback360/questions", feedback360QuestionRoutes);
app.use("/feedback360/question-sections", feedback360QuestionSectionRoutes);
app.use("/feedback360/responses",feedback360ResponseRoutes);
app.use("/feedback360/schools", feedback360SchoolRoutes);
app.use("/feedback360/departments", feedback360DepartmentRoutes);
app.use("/feedback360/forms", feedback360FormRoutes);
app.use("/feedback360/reports", feedback360ReportRoutes);
app.use("/feedback360/rounds", feedback360RoundRoutes);
app.use("/feedback360/assignments", feedback360RoleAssignmentRoutes);
app.use("/api/auth", authRoutes);




app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {

  res.status(err.status || 500).json({
    message: err.message,
    error: process.env.NODE_ENV === "development" ? err : {}
  });

});

module.exports = app;