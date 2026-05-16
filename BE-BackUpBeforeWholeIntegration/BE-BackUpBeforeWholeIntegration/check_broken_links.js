const mongoose = require('mongoose');
require('dotenv').config();

const CreateExam = require('./server/models/CoordinatorModels/ExamCreationModel');
const ExamType = require('./server/models/CoordinatorModels/ExamTypeModel');
const FYPTerm = require('./server/models/AdminModels/fypTerm');

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URL);

        const types = await ExamType.find({});
        console.log("--- Existing ExamTypes ---");
        const typeMap = {};
        types.forEach(t => {
            console.log(`ID: ${t._id}, Name: ${t.examName}`);
            typeMap[t._id.toString()] = t.examName;
        });

        const exams = await CreateExam.find({});
        console.log("\n--- CreateExam Documents ---");
        exams.forEach(e => {
            const typeId = e.ExamType ? e.ExamType.toString() : "NULL";
            const name = typeMap[typeId] || "UNKNOWN/BROKEN";
            console.log(`ExamID: ${e._id}`);
            console.log(`  Term: ${e.Term}`);
            console.log(`  ExamType Ref: ${typeId} -> ${name}`);
            console.log(`  Weightage: ${e.ExamWeightage}`);
        });

        await mongoose.disconnect();
    } catch (e) {
        console.error(e);
    }
}
check();
