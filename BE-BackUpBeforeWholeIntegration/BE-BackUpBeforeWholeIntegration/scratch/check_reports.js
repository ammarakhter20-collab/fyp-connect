const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/MIS";

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to MongoDB");

  const reports = await mongoose.connection.db.collection("studentreports").find({}).toArray();
  console.log("ALL REPORTS IN DATABASE:");
  for (const r of reports) {
    console.log({
      _id: r._id,
      FYPGroup: r.FYPGroup,
      Exam: r.Exam,
      status: r.status,
      uploadedAt: r.uploadedAt
    });
  }

  const exams = await mongoose.connection.db.collection("createexammodels").find({}).toArray();
  console.log("\nALL CREATED EXAMS:");
  for (const e of exams) {
    console.log({
      _id: e._id,
      ExamType: e.ExamType,
      AnnouncedDate: e.AnnouncedDate,
      ReportDeadline: e.ReportDeadline,
      status: e.status
    });
  }

  const examtypes = await mongoose.connection.db.collection("examtypes").find({}).toArray();
  console.log("\nALL EXAM TYPES:");
  for (const et of examtypes) {
    console.log({
      _id: et._id,
      examName: et.examName
    });
  }

  await mongoose.disconnect();
}

main().catch(console.error);
