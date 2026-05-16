const mongoose = require('mongoose');
const ExamCreation = require("./server/models/CoordinatorModels/ExamCreationModel");
const ExamTypeModel = require("./server/models/CoordinatorModels/ExamTypeModel");
const FYPTerm = require("./server/models/AdminModels/fypTerm");

async function run() {
    try {
        await mongoose.connect("mongodb://localhost:27017/MIS");
        console.log("Connected");

        const term = await FYPTerm.findOne({ sessionTerm: "Fall-2025" });
        if (!term) throw new Error("Term not found");
        console.log("Term:", term._id);

        const EXAMS = ["Proposal", "Attendance-I", "Mid-I", "Final-I"];

        for (const name of EXAMS) {
            console.log("--------------------------------");
            console.log(`Processing ${name}...`);

            let type = await ExamTypeModel.findOne({ examName: name });
            if (!type) {
                const shortCode = name.substring(0, 3).toUpperCase() + Math.floor(Math.random() * 1000);
                type = await ExamTypeModel.create({
                    examName: name,
                    shortCode: shortCode,
                    examTypeFor: "Coordinator"
                });
            }
            console.log(`Type ID (${name}): ${type._id}`);

            let exam = await ExamCreation.findOne({ Term: term._id, ExamType: type._id });
            if (!exam) {
                console.log(`Creating Exam: ${name}...`);
                try {
                    exam = await ExamCreation.create({
                        Term: term._id,
                        ExamType: type._id,
                        AnnouncedDate: new Date(),
                        ExamWeightage: 100
                    });
                    console.log(`Exam Created: ${exam._id}`);
                } catch (err) {
                    console.error("CREATE FAILED for " + name);
                    if (err.errors) console.error(err.errors);
                    else console.error(err);
                }
            } else {
                console.log(`Exam Exists: ${exam._id}`);
            }
        }

        await mongoose.disconnect();
    } catch (e) {
        console.error(e);
        if (mongoose.connection.readyState === 1) await mongoose.disconnect();
    }
}
run();
