const mongoose = require("mongoose");
require("dotenv").config();

// Models
const ExamType = require("./server/models/CoordinatorModels/ExamTypeModel");
const CreateExam = require("./server/models/CoordinatorModels/ExamCreationModel");
const CreateExamSchedule = require("./server/models/CoordinatorModels/ExamScheduleModel");
const FYPTerm = require("./server/models/AdminModels/fypTerm");
const PanelDetails = require("./server/models/CoordinatorModels/PenalModel");

const seedExamDefinitions = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/MIS");
        console.log("Connected to MongoDB");

        // 1. Get Term
        const term = await FYPTerm.findOne({ sessionTerm: "Fall-2025" });
        if (!term) {
            console.log("Term Fall-2025 not found!");
            return;
        }

        // 2. Create Exam Type "Final Defense"
        await ExamType.deleteMany({ shortCode: "FD-25" });
        let examType = await ExamType.create({
            examName: "Final Defense",
            shortCode: "FD-25",
            examTypeFor: "Supervisor" // or "All"
        });
        console.log("Created ExamType:", examType.examName);

        // 3. Create Exam Definition (CreateExam)
        // Deleting any existing for this term to avoid duplicates/confusion logic in controller
        await CreateExam.deleteMany({ Term: term._id });

        const createExam = await CreateExam.create({
            Term: term._id,
            ExamType: examType._id,
            ExamWeightage: 40,
            // Controller checks: AnnouncedDate: { $eq: new Date().toISOString().split("T")[0] }
            // So we must store it as midnight UTC or strictly the date component if possible.
            // Mongoose casts strings to Date. If we give "YYYY-MM-DD", it becomes ...T00:00:00.000Z
            AnnouncedDate: new Date().toISOString().split('T')[0],
        });
        console.log("Created Exam Definition:", createExam._id);

        // 4. Create Schedule (Optional but good for completeness)
        const panel = await PanelDetails.findOne({ panelCode: "PNL-TEST" });
        if (panel) {
            await CreateExamSchedule.deleteMany({ panel: panel._id });
            const schedule = await CreateExamSchedule.create({
                panel: panel._id,
                ExamDate: new Date(),
                ExamTime: "10:00AM",
                Venue: "Main Hall",
                CreatedExam: createExam._id
            });
            console.log("Created Exam Schedule for Panel:", panel.panelCode);
        } else {
            console.log("Panel PNL-TEST not found, skipping schedule.");
        }

        console.log("\n--- SUCCESS ---");
        console.log("Exam Definitions seeded. The Supervisor dashboard should now load.");

        await mongoose.disconnect();
    } catch (error) {
        console.error("Error seeding exam definitions:", error);
    }
};

seedExamDefinitions();
