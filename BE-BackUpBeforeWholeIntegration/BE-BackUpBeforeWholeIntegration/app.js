require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./server/routes/signup");
const authRoutes = require("./server/routes/auths");
const fypRoutes = require("./server/routes/fypRoutes");
const TopicRoutes = require("./server/routes/SupervisorRoutes/TopicRoutes");
const TaskRoutes = require("./server/routes/SupervisorRoutes/TaskAssigRoutes");
const coursecatRoutes = require("./server/routes/CoordinatorRoutes/CourseCatRoutes");
const ManageRoutes = require("./server/routes/CoordinatorRoutes/ManageRoutes");
const PanelRoutes = require("./server/routes/CoordinatorRoutes/PenalRoutes");
const taskMarksRoutes = require("./server/routes/SupervisorRoutes/taskMarks");
const FYPAttendanceRoute = require("./server/routes/SupervisorRoutes/FYPAttendanceRoute");
const ExamRoutes = require("./server/routes/CoordinatorRoutes/ExamAssignmentRoutes");
const CategoryRoutes = require("./server/routes/CoordinatorRoutes/AddCatRoutes");
const ExcelUserRoute = require("./server/routes/AdminRoutes/userCreation");
const fypAttendanceRoutes = require("./server/routes/SupervisorRoutes/FYPAttendanceRoute");
const createFYPRegRoutes = require("./server/routes/CoordinatorRoutes/CreateFYPRegRoutes");
const ExamTypeCrtRoutes = require("./server/routes/CoordinatorRoutes/ExamTypeRoutes");
const ManageSupPercRoutes = require("./server/routes/CoordinatorRoutes/ManagePercRoutes");
const QuestionOfCloRoutes = require("./server/routes/CoordinatorRoutes/QuesForCloRoutes");
const CLOsRoutes = require("./server/routes/CoordinatorRoutes/ManageCLOsRoutes");
const CLOForExamRoutes = require("./server/routes/CoordinatorRoutes/CLOForExamRoutes");
const ExamCreationROutes = require("./server/routes/CoordinatorRoutes/ExamCreationRoutes");
const ScheduleExamRoutes = require("./server/routes/CoordinatorRoutes/ExamScheduleRoutes");
const StdReportRoutes = require("./server/routes/CoordinatorRoutes/StudReportRoutes");
const EvalExam = require("./server/routes/CoordinatorRoutes/EvaluateExamRoutes");
const ExamDetails = require("./server/routes/SupervisorRoutes/FetchAssignedExams");
const feedbackToCoorRoutes = require("./server/routes/HoDRoutes/FeedbacktoCoordRoutes");
const ResultsController = require("./server/routes/CoordinatorRoutes/ResultsRoutes");
const CoordAnnouncementRoutes = require("./server/routes/CoordinatorRoutes/CoorAnnounRoutes");
const PassFailCriteriaRoutes = require("./server/routes/CoordinatorRoutes/PassFailCriteriaRoutes");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: "50mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/fyp", fypRoutes);
app.use("/api/suptopic", TopicRoutes);
app.use("/api/task", TaskRoutes);
app.use("/api/coursecat", coursecatRoutes);
app.use("/api/managefyp", ManageRoutes);
app.use("/api/taskMarks", taskMarksRoutes);
app.use("/api/excelUser", ExcelUserRoute);
app.use("/api/attendance", FYPAttendanceRoute);
app.use("/api/manageexampanels", PanelRoutes);
app.use("/api/manageexams", ExamRoutes);
app.use("/api/category", CategoryRoutes);
app.use("/api/ExamType", ExamTypeCrtRoutes);
app.use("/api/ManagePercentage", ManageSupPercRoutes);
app.use("/api/fypAttendance", fypAttendanceRoutes);
app.use("/api/CreateFypReg", createFYPRegRoutes);
app.use("/api/QuesForClo", QuestionOfCloRoutes);
app.use("/api/ManageCLOs", CLOsRoutes);
app.use("/api/ManageCLOForExam", CLOForExamRoutes);
app.use("/api/ExamCreationRoutes", ExamCreationROutes);
app.use("/api/ScheduleExamRoutes", ScheduleExamRoutes);
app.use("/api/StudentReport", StdReportRoutes);
app.use("/api/EvaluateExamRoutes", EvalExam);
app.use("/api/Exam-Assignments", ExamDetails);
app.use("/api/FeedbackToCoordinator", feedbackToCoorRoutes);
app.use("/api/Results", ResultsController);
app.use("/api/CoordAnnouncementRoutes", CoordAnnouncementRoutes);
app.use("/api/PassFailCriteria", PassFailCriteriaRoutes);

const staticFiles = require("./staticFiles");
app.use("/uploads", staticFiles);

mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running on - http://localhost:${process.env.PORT || 5000}`);
    });
  })
  .catch((error) => {
    console.log("DB Connection Error:", error);
  });

module.exports = app;
